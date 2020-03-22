import React from 'react';
import { Modal } from 'antd';
import { IPostTask } from '../data.d';

interface CreateFormProps extends Partial<IPostTask> {
  modalVisible: boolean;

  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="任务详情"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <div dangerouslySetInnerHTML={{
        __html: props.content ?? "<p>(内容为空)</p>"
      }}></div>
    </Modal>
  );
};

export default CreateForm;
