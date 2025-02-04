import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

function RichEditor({ placeholder, name, value, onChange, height }) {
    const editor = useRef(null);
    const options = ['bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'outdent', 'indent', 'align', '|', 'hr', '|', 'fullsize', 'brush', '|', 'table', 'link', '|', 'undo', 'redo',];
    const config = useMemo(
        () => ({
            placeholder: placeholder,
            readonly: false,
            // defaultActionOnPaste: 'insert_as_html',
            defaultLineHeight: 1.5,
            enter: 'div',
            // options that we defined in above step.
            buttons: options,
            buttonsMD: options,
            buttonsSM: options,
            buttonsXS: options,
            statusbar: false,
            sizeLG: 900,
            sizeMD: 700,
            sizeSM: 400,
            toolbarAdaptive: false,
        }),
        [],
    );

    return (
        <JoditEditor
            ref={editor}
            value={value}
            tabIndex={1}
            // onBlur={newContent => onChange({ target: { name, value: newContent } })}
            // onBlur={(newContent) => onChange(newContent)}
            onChange={newContent => { }}
            config={config}
        />
    );
}

export default RichEditor;