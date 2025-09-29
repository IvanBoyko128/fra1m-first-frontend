import { useReducer, useCallback } from 'react';
import type { Course, CourseAction, CourseState } from '../types/course';

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Изучите основы React: компоненты, состояние, пропсы и хуки',
    lessons: [
      'Введение в React',
      'Компоненты и JSX',
      'Состояние и пропсы',
      'Хуки',
    ],
    isFavorite: false,
  },
  {
    id: '2',
    title: 'TypeScript для React',
    description: 'Типизация в React приложениях с TypeScript',
    lessons: [
      'Основы TypeScript',
      'Типы в React',
      'Интерфейсы и дженерики',
      'Продвинутые паттерны',
    ],
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Ant Design UI',
    description: 'Создание красивых интерфейсов с Ant Design',
    lessons: [
      'Установка и настройка',
      'Компоненты',
      'Темы и стилизация',
      'Адаптивность',
    ],
    isFavorite: false,
  },
];

const initialState: CourseState = {
  courses: initialCourses,
  filteredCourses: initialCourses,
  searchQuery: '',
};

const filterCourses = (courses: Course[], query: string): Course[] => {
  if (!query.trim()) return courses;
  const lowerQuery = query.toLowerCase();
  return courses.filter(course =>
    course.title.toLowerCase().includes(lowerQuery)
  );
};

const updateFilteredCourses = (courses: Course[], searchQuery: string) => ({
  courses,
  filteredCourses: filterCourses(courses, searchQuery),
  searchQuery,
});

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'ADD_COURSE': {
      const newCourses = [...state.courses, action.payload];
      return {
        ...state,
        ...updateFilteredCourses(newCourses, state.searchQuery),
      };
    }

    case 'UPDATE_COURSE_TITLE': {
      const updatedCourses = state.courses.map(course =>
        course.id === action.payload.id
          ? { ...course, title: action.payload.title }
          : course
      );
      return {
        ...state,
        ...updateFilteredCourses(updatedCourses, state.searchQuery),
      };
    }

    case 'DELETE_COURSE': {
      const filteredCourses = state.courses.filter(
        course => course.id !== action.payload
      );
      return {
        ...state,
        ...updateFilteredCourses(filteredCourses, state.searchQuery),
      };
    }

    case 'TOGGLE_FAVORITE': {
      const updatedCourses = state.courses.map(course =>
        course.id === action.payload
          ? { ...course, isFavorite: !course.isFavorite }
          : course
      );
      return {
        ...state,
        ...updateFilteredCourses(updatedCourses, state.searchQuery),
      };
    }

    case 'FILTER_COURSES': {
      return {
        ...state,
        filteredCourses: filterCourses(state.courses, action.payload),
        searchQuery: action.payload,
      };
    }

    default:
      return state;
  }
}

export function useCourseReducer() {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  const addCourse = useCallback((course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_COURSE', payload: newCourse });
  }, []);

  const updateCourseTitle = useCallback((id: string, title: string) => {
    dispatch({ type: 'UPDATE_COURSE_TITLE', payload: { id, title } });
  }, []);

  const deleteCourse = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COURSE', payload: id });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  }, []);

  const filterCoursesByQuery = useCallback((query: string) => {
    dispatch({ type: 'FILTER_COURSES', payload: query });
  }, []);

  return {
    state,
    addCourse,
    updateCourseTitle,
    deleteCourse,
    toggleFavorite,
    filterCourses: filterCoursesByQuery,
  };
}
