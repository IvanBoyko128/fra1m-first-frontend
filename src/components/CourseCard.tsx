import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Input, Space, message, Popconfirm } from 'antd';
import {
  StarOutlined,
  StarFilled,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { Course } from '../types/course';
import styles from './CourseCard.module.scss';

interface CourseCardProps {
  course: Course;
  onToggleFavorite: (_id: string) => void;
  onDelete: (_id: string) => void;
  onUpdateTitle: (_id: string, _title: string) => void;
  onShowDetails: (_course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onToggleFavorite,
  onDelete,
  onUpdateTitle,
  onShowDetails,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(course.title);

  const handleSaveTitle = useCallback(() => {
    if (editTitle.trim() && editTitle !== course.title) {
      onUpdateTitle(course.id, editTitle.trim());
      message.success('Название курса обновлено!');
    }
    setIsEditing(false);
  }, [editTitle, course.title, course.id, onUpdateTitle]);

  const handleCancelEdit = useCallback(() => {
    setEditTitle(course.title);
    setIsEditing(false);
  }, [course.title]);

  const handleDelete = useCallback(() => {
    onDelete(course.id);
    message.success('Курс удален!');
  }, [course.id, onDelete]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(course.id);
  }, [course.id, onToggleFavorite]);

  const handleShowDetails = useCallback(() => {
    onShowDetails(course);
  }, [course, onShowDetails]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const favoriteIcon = useMemo(
    () =>
      course.isFavorite ? (
        <StarFilled className={styles.favoriteButton} />
      ) : (
        <StarOutlined />
      ),
    [course.isFavorite]
  );

  const favoriteTitle = useMemo(
    () => (course.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'),
    [course.isFavorite]
  );

  return (
    <Card
      className={styles.card}
      title={
        isEditing ? (
          <Input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onPressEnter={handleSaveTitle}
            onBlur={handleSaveTitle}
            autoFocus
            className={styles.editInput}
          />
        ) : (
          <div className={styles.cardTitle}>
            <span>{course.title}</span>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={handleStartEdit}
              size='small'
              className={styles.editButton}
            />
          </div>
        )
      }
      extra={
        <Button
          type='text'
          icon={favoriteIcon}
          onClick={handleToggleFavorite}
          title={favoriteTitle}
          className={styles.favoriteButton}
        />
      }
      actions={[
        <Button
          key='details'
          type='primary'
          icon={<EyeOutlined />}
          onClick={handleShowDetails}
        >
          Подробнее
        </Button>,
        <Popconfirm
          key='delete'
          title='Удалить курс?'
          description='Это действие нельзя отменить'
          onConfirm={handleDelete}
          okText='Да'
          cancelText='Нет'
        >
          <Button danger icon={<DeleteOutlined />}>
            Удалить
          </Button>
        </Popconfirm>,
      ]}
    >
      <p className={styles.description}>{course.description}</p>
      <div className={styles.lessonsCount}>Уроков: {course.lessons.length}</div>
      {isEditing && (
        <div className={styles.editActions}>
          <Space>
            <Button
              size='small'
              type='primary'
              onClick={handleSaveTitle}
              className={styles.saveButton}
            >
              Сохранить
            </Button>
            <Button
              size='small'
              onClick={handleCancelEdit}
              className={styles.cancelButton}
            >
              Отмена
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};
