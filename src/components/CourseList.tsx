import React from 'react';
import { Empty } from 'antd';
import type { Course } from '../types/course';
import { CourseCard } from './CourseCard';
import styles from './CourseList.module.scss';

interface CourseListProps {
  courses: Course[];
  onToggleFavorite: (_id: string) => void;
  onDelete: (_id: string) => void;
  onUpdateTitle: (_id: string, _title: string) => void;
  onShowDetails: (_course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  onToggleFavorite,
  onDelete,
  onUpdateTitle,
  onShowDetails,
}) => {
  if (courses.length === 0) {
    return (
      <div className={styles.grid}>
        <Empty description='Курсы не найдены' className={styles.empty} />
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {courses.map(course => (
        <div key={course.id} className={styles.gridItem}>
          <CourseCard
            course={course}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onUpdateTitle={onUpdateTitle}
            onShowDetails={onShowDetails}
          />
        </div>
      ))}
    </div>
  );
};
