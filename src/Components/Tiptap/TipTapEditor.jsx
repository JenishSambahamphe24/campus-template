
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import FontSize from '@tiptap/extension-font-size';
import { Extension } from '@tiptap/core';

// Styling for the editor
import './RichEditor.css';

// Custom extension for list style types
const CustomBulletList = Extension.create({
  name: 'customBulletList',
  addGlobalAttributes() {
    return [
      {
        types: ['bulletList'],
        attributes: {
          listStyleType: {
            default: 'disc',
            parseHTML: element => element.style.listStyleType || 'disc',
            renderHTML: attributes => {
              if (!attributes.listStyleType) {
                return {};
              }
              return {
                style: `list-style-type: ${attributes.listStyleType}`,
              };
            },
          },
        },
      },
    ];
  },
});

const CustomOrderedList = Extension.create({
  name: 'customOrderedList',
  addGlobalAttributes() {
    return [
      {
        types: ['orderedList'],
        attributes: {
          listStyleType: {
            default: 'decimal',
            parseHTML: element => element.style.listStyleType || 'decimal',
            renderHTML: attributes => {
              if (!attributes.listStyleType) {
                return {};
              }
              return {
                style: `list-style-type: ${attributes.listStyleType}`,
              };
            },
          },
        },
      },
    ];
  },
});

function TipTapEditor({ placeholder, name, value, onChange, height }) {
  const [content, setContent] = useState(value || '');

  // Initialize TipTap editor with required extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      CustomBulletList,
      CustomOrderedList,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);
      onChange(newContent);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        style: `min-height: ${height || 200}px;`,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined && value !== content) {
      editor.commands.setContent(value);
      setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  // Menu button helper component
  const MenuButton = ({ onClick, isActive, icon, title }) => (
    <button
      onMouseDown={(e) => e.preventDefault()} // Prevent button focus loss
      onClick={onClick}
      className={`menu-button ${isActive ? 'is-active' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );

  const fontSizes = [
    '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'
  ];

  const fontColors = [
    '#000000','#808080', '#800000', '#808000', '#008080', '#000080'
  ];

  const bulletListStyles = [
    { value: 'disc', label: '● Disc' },
    { value: 'circle', label: '○ Circle' },
    { value: 'square', label: '■ Square' },
    { value: 'none', label: 'None' }
  ];

  const orderedListStyles = [
    { value: 'decimal', label: '1, 2, 3' },
    { value: 'lower-alpha', label: 'a, b, c' },
    { value: 'upper-alpha', label: 'A, B, C' },
    { value: 'lower-roman', label: 'i, ii, iii' },
    { value: 'upper-roman', label: 'I, II, III' }
  ];

  const setBulletListStyle = (type) => {
    editor.chain().focus().updateAttributes('bulletList', { listStyleType: type }).run();
  };

  const setOrderedListStyle = (type) => {
    editor.chain().focus().updateAttributes('orderedList', { listStyleType: type }).run();
  };

  // Main toolbar JSX
  const ToolBar = () => (
    <div className="editor-menu">
      <div className="menu-group">
        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontSize || ''}
          className="font-size-select"
        >
          <option value="">Font Size</option>
          {fontSizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <div className="color-picker ml-3">
          <span className="color-label">Color:</span>
          {fontColors.map((color) => (
            <button
              key={color}
              className="color-button"
              style={{ backgroundColor: color }}
              onClick={() => editor.chain().focus().setColor(color).run()}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="menu-group">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon="B"
          title="Bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon="I"
          title="Italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon="U"
          title="Underline"
        />
      </div>

      <div className="menu-group">
        <select
          onChange={(e) => {
            if (e.target.value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else if (e.target.value.startsWith('heading')) {
              const level = parseInt(e.target.value.split('-')[1]);
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? 'heading-1' :
            editor.isActive('heading', { level: 2 }) ? 'heading-2' :
            editor.isActive('heading', { level: 3 }) ? 'heading-3' :
            'paragraph'
          }
          className="block-type-select"
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading-1">Heading 1</option>
          <option value="heading-2">Heading 2</option>
          <option value="heading-3">Heading 3</option>
        </select>
      </div>

      <div className="menu-group">
        <div className="list-controls">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon="• List"
            title="Bullet List"
          />
          {editor.isActive('bulletList') && (
            <select
              className="list-style-select"
              value={editor.getAttributes('bulletList').listStyleType || 'disc'}
              onChange={(e) => setBulletListStyle(e.target.value)}
            >
              {bulletListStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="list-controls">
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon="1. List"
            title="Ordered List"
          />
          {editor.isActive('orderedList') && (
            <select
              className="list-style-select"
              value={editor.getAttributes('orderedList').listStyleType || 'decimal'}
              onChange={(e) => setOrderedListStyle(e.target.value)}
            >
              {orderedListStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="menu-group">
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon="⟵"
          title="Align Left"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon="⟷"
          title="Align Center"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon="⟶"
          title="Align Right"
        />
      </div>
    </div>
  );

  return (
    <div className="tiptap-editor" style={{ height }}>
      <ToolBar />
      <EditorContent editor={editor} />
      {placeholder && !editor.getText() && (
        <div className="placeholder">{placeholder}</div>
      )}
    </div>
  );
}

export default TipTapEditor;
