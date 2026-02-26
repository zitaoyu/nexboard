import type { WidgetDefinition } from '@/types/widget'
import { TodoWidget } from './TodoWidget'

export const todoSummaryWidget: WidgetDefinition = {
  manifest: {
    id: 'todo:summary',
    name: 'Todo Summary',
    description: 'Shows pending task count and most urgent items',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 4, h: 6 },
    sourceProgram: 'todo',
    icon: 'ListTodo'
  },
  Component: TodoWidget
}
