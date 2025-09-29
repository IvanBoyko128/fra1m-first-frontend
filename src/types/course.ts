export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  isFavorite: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  lessons: string;
}

export type CourseAction =
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE_TITLE'; payload: { id: string; title: string } }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'FILTER_COURSES'; payload: string };

export interface CourseState {
  courses: Course[];
  filteredCourses: Course[];
  searchQuery: string;
}
