import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

function FileUpload(name, value, onChange, label) {
    return (
        <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture"
            name={name}
            value={value}
        >
            <Button type="primary"  icon={<UploadOutlined />}>
                Upload  File
            </Button>
        </Upload>
    );
}

export default FileUpload;