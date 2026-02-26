import type { MiniProgramDefinition } from '@/types/mini-program'
import { TodoApp } from './TodoApp'
import { todoSummaryWidget } from './widgets/manifest'

export const todoProgram: MiniProgramDefinition = {
  manifest: {
    id: 'todo',
    name: 'Todo',
    description: 'Manage tasks with due dates and priorities',
    icon: 'ListTodo',
    color: '#a855f7'
  },
  AppComponent: TodoApp,
  widgets: [todoSummaryWidget]
}
