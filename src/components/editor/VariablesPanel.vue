<script setup lang="ts">
import { useProjectStore } from "@/stores/projectStore";
import type { VariableType } from "@/types/types";

const store = useProjectStore();

function parseDefaultValue(type: VariableType, raw: string) {
  if (type === "number") return Number(raw || 0);
  if (type === "boolean") {
    const v = raw.trim().toLowerCase();
    return v === "true" || v === "1" || v === "да" || v === "yes";
  }
  return raw;
}
</script>

<template>
  <section class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/15 ring-1 ring-white/[0.05] backdrop-blur-sm">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-slate-200">Переменные</h2>
      <button
        type="button"
        class="rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
        @click="store.addVariable"
      >
        Добавить
      </button>
    </div>

    <p v-if="!store.project.variables.length" class="text-xs text-slate-500">Нет переменных. Они попадут в экспорт как default в Ren'Py.</p>

    <div class="space-y-2">
      <div v-for="variable in store.project.variables" :key="variable.id" class="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-1.5">
        <input
          class="min-w-0 rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/30"
          title="Имя в коде (латиница без пробелов)"
          :value="variable.key"
          @input="store.updateVariable(variable.id, { key: ($event.target as HTMLInputElement).value })"
        />
        <select
          class="rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100"
          :value="variable.type"
          @change="
            store.updateVariable(variable.id, {
              type: ($event.target as HTMLSelectElement).value as VariableType
            })
          "
        >
          <option value="number">число</option>
          <option value="boolean">да/нет</option>
          <option value="string">строка</option>
        </select>
        <input
          class="min-w-0 rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/30"
          :placeholder="variable.type === 'boolean' ? 'true / false' : ''"
          :value="String(variable.defaultValue)"
          @input="
            store.updateVariable(variable.id, {
              defaultValue: parseDefaultValue(variable.type, ($event.target as HTMLInputElement).value)
            })
          "
        />
        <button
          type="button"
          class="rounded-lg bg-rose-600/90 px-2 py-1.5 text-xs text-white hover:bg-rose-500"
          title="Удалить"
          @click="store.removeVariable(variable.id)"
        >
          ×
        </button>
      </div>
    </div>
  </section>
</template>
