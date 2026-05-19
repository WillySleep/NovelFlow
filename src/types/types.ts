export type VariableType = "number" | "boolean" | "string";

export interface StoryVariable {
  id: string;
  key: string;
  type: VariableType;
  defaultValue: number | boolean | string;
}

export interface Condition {
  variableKey: string;
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=";
  value: number | boolean | string;
}

export interface Effect {
  variableKey: string;
  operation: "set" | "add";
  value: number | boolean | string;
}

export interface Choice {
  id: string;
  text: string;
  targetNodeId: string;
  conditions: Condition[];
  effects: Effect[];
}

export interface SceneNode {
  id: string;
  title: string;
  characterName: string;
  text: string;
  backgroundAssetId: string;
  spriteAssetId: string;
  effects: Effect[];
  choices: Choice[];
}

export interface StoryAsset {
  id: string;
  name: string;
  kind: "background" | "sprite";
  mimeType: string;
  dataUrl: string;
}

export interface StoryProject {
  id: string;
  title: string;
  startNodeId: string;
  nodes: SceneNode[];
  variables: StoryVariable[];
  assets: StoryAsset[];
  updatedAt: string;
}

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}
