import React, { useState, useCallback } from 'react';
import { Layout, Typography, Input, Button, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useCourseReducer } from './hooks/useCourseReducer';
import { CourseList } from './components/CourseList';
import { AddCourseModal } from './components/AddCourseModal';
import { CourseDetailsModal } from './components/CourseDetailsModal';
import type { Course, CourseFormData } from './types/course';
import styles from './App.module.scss';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

function App() {
  const {
    state,
    addCourse,
    updateCourseTitle,
    deleteCourse,
    toggleFavorite,
    filterCourses,
  } = useCourseReducer();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleAddCourse = useCallback(
    (courseData: CourseFormData) => {
      const lessons = courseData.lessons
        .split(',')
        .map(lesson => lesson.trim())
        .filter(lesson => lesson.length > 0);

      addCourse({
        title: courseData.title,
        description: courseData.description,
        lessons,
        isFavorite: false,
      });

      setIsAddModalVisible(false);
    },
    [addCourse]
  );

  const handleShowDetails = useCallback((course: Course) => {
    setSelectedCourse(course);
    setIsDetailsModalVisible(true);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      filterCourses(value);
    },
    [filterCourses]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filterCourses(e.target.value);
    },
    [filterCourses]
  );

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalVisible(false);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(false);
    setSelectedCourse(null);
  }, []);

  return (
    <Layout className={styles.app}>
      <Header className={styles.header}>
        <Title level={2} className={styles.headerTitle}>
          fra1m Courses
        </Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
          className={styles.addButton}
        >
          Добавить курс
        </Button>
      </Header>

      <Content className={styles.content}>
        <div className={styles.container}>
          <Space
            direction='vertical'
            size='large'
            className={styles.courseList}
          >
            <div className={styles.headerSection}>
              <Title level={3} className={styles.sectionTitle}>
                Список курсов ({state.filteredCourses.length})
              </Title>
              <Search
                placeholder='Поиск по названию курса'
                allowClear
                enterButton={<SearchOutlined />}
                size='large'
                className={styles.searchInput}
                onSearch={handleSearch}
                onChange={handleSearchChange}
              />
            </div>

            <CourseList
              courses={state.filteredCourses}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteCourse}
              onUpdateTitle={updateCourseTitle}
              onShowDetails={handleShowDetails}
            />
          </Space>
        </div>
      </Content>

      <AddCourseModal
        visible={isAddModalVisible}
        onCancel={handleCloseAddModal}
        onAdd={handleAddCourse}
      />

      <CourseDetailsModal
        visible={isDetailsModalVisible}
        course={selectedCourse}
        onCancel={handleCloseDetailsModal}
      />
    </Layout>
  );
}

export default App;
