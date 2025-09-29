import React from 'react';
import { Modal, List, Typography, Tag } from 'antd';
import type { Course } from '../types/course';
import styles from './CourseDetailsModal.module.scss';

const { Title, Paragraph } = Typography;

interface CourseDetailsModalProps {
  visible: boolean;
  course: Course | null;
  onCancel: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  visible,
  course,
  onCancel,
}) => {
  if (!course) return null;

  return (
    <Modal
      title={course.title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className={styles.modal}
    >
      <div className={styles.description}>
        <Title level={4} className={styles.descriptionTitle}>
          Описание
        </Title>
        <Paragraph className={styles.descriptionText}>
          {course.description}
        </Paragraph>
      </div>

      <div className={styles.lessons}>
        <Title level={4} className={styles.lessonsTitle}>
          Уроки курса
        </Title>
        <List
          dataSource={course.lessons}
          renderItem={(lesson, index) => (
            <List.Item className={styles.lessonItem}>
              <Tag color='blue' className={styles.lessonTag}>
                Урок {index + 1}
              </Tag>
              <span className={styles.lessonText}>{lesson}</span>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};
