import type { Choice, Condition, Effect, StoryProject } from "@/types/types";

export function exportProjectToRenpy(project: StoryProject): string {
  const lines: string[] = [];
  lines.push("# Сгенерировано NovelFlow");
  lines.push("");
  lines.push("label start:");
  lines.push(`    jump ${toLabel(project.startNodeId)}`);
  lines.push("");

  for (const variable of project.variables) {
    lines.push(`default ${variable.key} = ${toRenpyValue(variable.defaultValue)}`);
  }
  if (project.variables.length) {
    lines.push("");
  }

  for (const node of project.nodes) {
    lines.push(`label ${toLabel(node.id)}:`);

    if (node.backgroundAssetId) {
      lines.push(`    # TODO: show background ${node.backgroundAssetId}`);
    }
    if (node.spriteAssetId) {
      lines.push(`    # TODO: show sprite ${node.spriteAssetId}`);
    }

    for (const effect of node.effects) {
      lines.push(`    ${effectToRenpy(effect)}`);
    }

    if (node.characterName.trim()) {
      lines.push(`    "${node.characterName}" "${escapeText(node.text)}"`);
    } else {
      lines.push(`    "${escapeText(node.text)}"`);
    }

    if (!node.choices.length) {
      lines.push("    return");
      lines.push("");
      continue;
    }

    lines.push("    menu:");
    for (const choice of node.choices) {
      appendChoice(lines, choice);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function appendChoice(lines: string[], choice: Choice) {
  const condition = conditionsToRenpy(choice.conditions);
  if (condition) {
    lines.push(`        "${escapeText(choice.text)}" if ${condition}:`);
  } else {
    lines.push(`        "${escapeText(choice.text)}":`);
  }
  for (const effect of choice.effects) {
    lines.push(`            ${effectToRenpy(effect)}`);
  }
  lines.push(`            jump ${toLabel(choice.targetNodeId)}`);
}

function conditionsToRenpy(conditions: Condition[]): string {
  if (!conditions.length) return "";
  return conditions.map((condition) => `${condition.variableKey} ${condition.operator} ${toRenpyValue(condition.value)}`).join(" and ");
}

function effectToRenpy(effect: Effect): string {
  if (effect.operation === "add") {
    return `$ ${effect.variableKey} += ${toRenpyValue(effect.value)}`;
  }
  return `$ ${effect.variableKey} = ${toRenpyValue(effect.value)}`;
}

function toRenpyValue(value: string | number | boolean): string {
  if (typeof value === "string") return `"${escapeText(value)}"`;
  if (typeof value === "boolean") return value ? "True" : "False";
  return String(value);
}

function toLabel(id: string): string {
  return `node_${id.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function escapeText(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
