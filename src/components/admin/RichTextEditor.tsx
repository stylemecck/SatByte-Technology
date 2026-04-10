import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote, Link as LinkIcon, Code, Table as TableIcon, Trash2, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'max-w-none focus:outline-none min-h-[400px] p-6 border border-t-0 border-slate-200 dark:border-white/10 rounded-b-xl bg-white dark:bg-[#0f172a] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:border-primary [&_blockquote]:italic [&_pre]:bg-slate-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-md [&_a]:text-blue-500 [&_a]:underline [&_p]:mb-4 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:border [&_table]:border-slate-300 dark:[&_table]:border-slate-700 [&_th]:border [&_th]:border-slate-300 dark:[&_th]:border-slate-700 [&_th]:p-2 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-800 [&_td]:border [&_td]:border-slate-300 dark:[&_td]:border-slate-700 [&_td]:p-2',
      },
    },
  })

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="w-full flex flex-col rounded-xl shadow-sm border border-slate-200 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-2 rounded-t-xl">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-slate-200 dark:bg-white/20' : ''}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
          <TableIcon className="h-4 w-4" />
        </Button>
        {editor.isActive('table') && (
          <div className="flex flex-wrap gap-1 bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md ml-auto">
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Col Before">
              <ArrowLeftFromLine className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Col After">
              <ArrowRightFromLine className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Col">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before">
              <ArrowUpFromLine className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row After">
              <ArrowDownFromLine className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
              Delete
            </Button>
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
