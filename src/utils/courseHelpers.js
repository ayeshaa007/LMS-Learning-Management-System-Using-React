// Stable keys for every lesson/quiz/assignment in a course, in the same order
// the course player shows them. Progress is stored against these keys.
export const getCourseItemKeys = (course) => {
  if (!course || !Array.isArray(course.modules)) return [];
  return course.modules.flatMap((m, mi) => [
    ...(m.lessons || []).map((_, i) => `lesson-${mi}-${i}`),
    ...(m.quizes || []).map((_, i) => `quiz-${mi}-${i}`),
    ...(m.assignments || []).map((_, i) => `assignment-${mi}-${i}`),
  ]);
};
