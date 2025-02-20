import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

function FileUpload({ name, value, onFileSelect, label, disabled, required }) {
  const handleChange = (info) => {
    if (info.file.status === 'done') {
      // If the file is uploaded successfully
      if (onFileSelect) {
        onFileSelect(info.file.originFileObj);
      }
    }
  };

  return (
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      name={name}
      value={value}
      disabled={disabled}
      onChange={handleChange}
    >
      <Button 
        type="primary" 
        disabled={disabled} 
        icon={<UploadOutlined />}
      >
        {label || 'Upload File'}
        {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
      </Button>
    </Upload>
  );
}

export default FileUpload;