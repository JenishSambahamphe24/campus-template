import  { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  ShowBlocks,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  WordCount
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

function TipTapEditor({ placeholder, name, value, onChange, height = 400, maxHeight = 800 }) {
  const [content, setContent] = useState(value || '');
  const [wordCount, setWordCount] = useState({ characters: 0, words: 0 });
  const [isReady, setIsReady] = useState(false);
  const editorRef = useRef(null);
  const editorId = useRef(`editor-${Math.random().toString(36).substr(2, 9)}`);

  // Generate dynamic CSS based on height prop
  const getDynamicEditorStyles = (minHeight, maxHeight) => `
    .${editorId.current} .ck-editor__editable {
      min-height: ${minHeight}px !important;
      max-height: ${maxHeight}px !important;
      overflow-y: auto;
    }
    
    .${editorId.current} .ck.ck-editor {
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .${editorId.current} .ck.ck-editor__main > .ck-editor__editable {
      background: white;
      border: none;
      padding: 1em;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .${editorId.current} .ck.ck-editor__main > .ck-editor__editable:focus {
      border: none;
      box-shadow: none;
    }
    
    .${editorId.current} .ck.ck-toolbar {
      border-bottom: 1px solid #ccc;
      background: #f8f9fa;
      padding: 8px;
    }
    
    .${editorId.current} .ck.ck-toolbar .ck-toolbar__items {
      flex-wrap: wrap;
    }
    
    .${editorId.current} .editor-container {
      margin: 1rem 0;
    }
    
    .${editorId.current} .word-count {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .${editorId.current} .editor-placeholder {
      position: absolute;
      top: 1em;
      left: 1em;
      color: #999;
      pointer-events: none;
      font-style: italic;
    }
  `;

  // CKEditor configuration with maximum features
  const editorConfig = {
    plugins: [
      AccessibilityHelp,
      Alignment,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      Mention,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      ShowBlocks,
      SimpleUploadAdapter,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
      WordCount
    ],
    
    toolbar: {
      items: [
        'undo', 'redo',
        '|',
        'showBlocks', 'findAndReplace', 'selectAll',
        '|',
        'heading', 'style',
        '|',
        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
        '|',
        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat',
        '|',
        'specialCharacters', 'horizontalLine', 'pageBreak',
        '|',
        'link', 'insertImage', 'mediaEmbed', 'insertTable', 'highlight', 'blockQuote', 'codeBlock', 'htmlEmbed',
        '|',
        'alignment',
        '|',
        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
      ],
      shouldNotGroupWhenFull: false
    },
    
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    
    fontSize: {
      options: [
        9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
      ],
      supportAllValues: true
    },
    
    fontFamily: {
      supportAllValues: true,
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    
    fontColor: {
      colors: [
        { color: 'hsl(0, 0%, 0%)', label: 'Black' },
        { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
        { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
        { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
        { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
        { color: 'hsl(0, 75%, 60%)', label: 'Red' },
        { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
        { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
        { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
        { color: 'hsl(120, 75%, 60%)', label: 'Green' },
        { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
        { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
        { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
        { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
        { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
      ]
    },
    
    fontBackgroundColor: {
      colors: [
        { color: 'hsl(0, 0%, 0%)', label: 'Black' },
        { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
        { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
        { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
        { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
        { color: 'hsl(0, 75%, 60%)', label: 'Red' },
        { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
        { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
        { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
        { color: 'hsl(120, 75%, 60%)', label: 'Green' },
        { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
        { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
        { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
        { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
        { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
      ]
    },
    
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    
    image: {
      styles: [
        'alignCenter',
        'alignLeft',
        'alignRight'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],
      toolbar: [
        'imageTextAlternative', 'toggleImageCaption',
        '|',
        'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side',
        '|',
        'resizeImage'
      ]
    },
    
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    
    style: {
      definitions: [
        {
          name: 'Article category',
          element: 'h3',
          classes: ['category']
        },
        {
          name: 'Title',
          element: 'h2',
          classes: ['document-title']
        },
        {
          name: 'Subtitle',
          element: 'h3',
          classes: ['document-subtitle']
        },
        {
          name: 'Info box',
          element: 'p',
          classes: ['info-box']
        },
        {
          name: 'Side quote',
          element: 'blockquote',
          classes: ['side-quote']
        },
        {
          name: 'Marker',
          element: 'span',
          classes: ['marker']
        },
        {
          name: 'Spoiler',
          element: 'span',
          classes: ['spoiler']
        },
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark']
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright']
        }
      ]
    },
    
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    },
    
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [
            '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
            '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
            '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
            '@sugar', '@sweet', '@topping', '@wafer'
          ],
          minimumCharacters: 1
        }
      ]
    },
    
    placeholder: placeholder || 'Start writing...',
    
    wordCount: {
      onUpdate: stats => {
        setWordCount(stats);
      }
    }
  };

  // Update content when value prop changes
  useEffect(() => {
    if (isReady && editorRef.current && value !== undefined && value !== content) {
      editorRef.current.setData(value);
      setContent(value);
    }
  }, [value, isReady, content]);

  // Handle editor change
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
    if (onChange) {
      onChange(data);
    }
  };

  // Handle editor ready
  const handleEditorReady = (editor) => {
    editorRef.current = editor;
    setIsReady(true);
    
    // Set initial content if provided
    if (value) {
      editor.setData(value);
      setContent(value);
    }
  };

  return (
    <>
      <style>{getDynamicEditorStyles(height, maxHeight)}</style>
      <div className={`editor-container ${editorId.current}`}>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={content}
          onChange={handleEditorChange}
          onReady={handleEditorReady}
          onError={(error, { willEditorRestart }) => {
            console.error('CKEditor Error:', error);
            if (willEditorRestart) {
              console.log('Editor will restart');
            }
          }}
        />
        
        {/* Word count display */}
        <div className="word-count">
          Words: {wordCount.words} | Characters: {wordCount.characters}
        </div>
      </div>
    </>
  );
}

export default TipTapEditor;