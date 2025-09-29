import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { CourseFormData } from '../types/course';
import styles from './AddCourseModal.module.scss';

interface AddCourseModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (_course: CourseFormData) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  visible,
  onCancel,
  onAdd,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const courseData: CourseFormData = {
        title: values.title,
        description: values.description,
        lessons: values.lessons,
      };

      onAdd(courseData);
      form.resetFields();
      message.success('Курс успешно добавлен!');
    } catch (_error) {
      // Ошибка валидации обработана
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title='Добавить новый курс'
      open={visible}
      onCancel={handleCancel}
      className={styles.modal}
      footer={[
        <Button
          key='cancel'
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Отмена
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          Добавить курс
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        requiredMark={false}
        className={styles.form}
      >
        <Form.Item
          name='title'
          label='Название курса'
          className={styles.formItem}
          rules={[
            { required: true, message: 'Пожалуйста, введите название курса!' },
            { min: 3, message: 'Название должно содержать минимум 3 символа!' },
          ]}
        >
          <Input
            placeholder='Введите название курса'
            className={styles.titleInput}
          />
        </Form.Item>

        <Form.Item
          name='description'
          label='Описание курса'
          className={styles.formItem}
          rules={[
            { required: true, message: 'Пожалуйста, введите описание курса!' },
            {
              min: 10,
              message: 'Описание должно содержать минимум 10 символов!',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder='Введите описание курса'
            className={styles.descriptionInput}
          />
        </Form.Item>

        <Form.Item
          name='lessons'
          label='Уроки (через запятую)'
          className={styles.formItem}
          rules={[{ required: true, message: 'Пожалуйста, введите уроки!' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder='Введите уроки через запятую'
            className={styles.lessonsInput}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
