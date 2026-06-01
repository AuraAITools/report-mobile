/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetAccountById($accountId: ID!) {\n    getAccountById(accountId: $accountId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n": typeof types.GetAccountByIdDocument,
    "\n  query GetAccountByUserId($institutionId: ID!, $userId: ID!) {\n    getAccountByUserId(institutionId: $institutionId, userId: $userId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n": typeof types.GetAccountByUserIdDocument,
    "\n  query GetAllAccountsInInstitution($institutionId: ID!) {\n    getAllAccountsInInstitution(institutionId: $institutionId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      parentFeatureState\n      educatorFeatureState\n      staffFeatureState\n    }\n  }\n": typeof types.GetAllAccountsInInstitutionDocument,
    "\n  mutation UpdateEducatorById($input: UpdateEducatorByIdInput!) {\n    updateEducatorById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      startDate\n      employmentType\n    }\n  }\n": typeof types.UpdateEducatorByIdDocument,
    "\n  mutation UpdateParentById($input: UpdateParentByIdInput!) {\n    updateParentById(input: $input) {\n      id\n      relationship\n      profileImageUrl\n    }\n  }\n": typeof types.UpdateParentByIdDocument,
    "\n  mutation RequestAccountProfileImageUpload(\n    $input: RequestAccountProfileImageUploadInput!\n  ) {\n    requestAccountProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": typeof types.RequestAccountProfileImageUploadDocument,
    "\n  mutation ConfirmAccountProfileImageUpload(\n    $input: ConfirmAccountProfileImageUploadInput!\n  ) {\n    confirmAccountProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": typeof types.ConfirmAccountProfileImageUploadDocument,
    "\n  mutation RequestParentProfileImageUpload(\n    $input: RequestParentProfileImageUploadInput!\n  ) {\n    requestParentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": typeof types.RequestParentProfileImageUploadDocument,
    "\n  mutation ConfirmParentProfileImageUpload(\n    $input: ConfirmParentProfileImageUploadInput!\n  ) {\n    confirmParentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": typeof types.ConfirmParentProfileImageUploadDocument,
    "\n  mutation RequestEducatorProfileImageUpload(\n    $input: RequestEducatorProfileImageUploadInput!\n  ) {\n    requestEducatorProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": typeof types.RequestEducatorProfileImageUploadDocument,
    "\n  mutation ConfirmEducatorProfileImageUpload(\n    $input: ConfirmEducatorProfileImageUploadInput!\n  ) {\n    confirmEducatorProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": typeof types.ConfirmEducatorProfileImageUploadDocument,
    "\n  mutation RequestStudentProfileImageUpload(\n    $input: RequestStudentProfileImageUploadInput!\n  ) {\n    requestStudentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": typeof types.RequestStudentProfileImageUploadDocument,
    "\n  mutation ConfirmStudentProfileImageUpload(\n    $input: ConfirmStudentProfileImageUploadInput!\n  ) {\n    confirmStudentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": typeof types.ConfirmStudentProfileImageUploadDocument,
    "\n  mutation UpdateStudentById($input: UpdateStudentByIdInput!) {\n    updateStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n    }\n  }\n": typeof types.UpdateStudentByIdDocument,
    "\n  query GetAllCoursesInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllCoursesInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n    }\n  }\n": typeof types.GetAllCoursesInOutletDocument,
    "\n  query GetCourseById($courseId: ID!) {\n    getCourseById(courseId: $courseId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n      educators {\n        id\n        name\n        email\n      }\n      students {\n        id\n        name\n        email\n      }\n      lessons {\n        id\n        name\n        lessonStartTimestamptz\n        lessonEndTimestamptz\n        state\n      }\n    }\n  }\n": typeof types.GetCourseByIdDocument,
    "\n  query GetInstitution($institutionId: ID!) {\n    getInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n": typeof types.GetInstitutionDocument,
    "\n  query GetInstitutionsByIds($institutionIds: [ID!]!) {\n    getInstitutionsByIds(institutionIds: $institutionIds) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n": typeof types.GetInstitutionsByIdsDocument,
    "\n  query GetAllLessonsInCourse($institutionId: ID!, $courseId: ID!) {\n    getAllLessonsInCourse(institutionId: $institutionId, courseId: $courseId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      subjects {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetAllLessonsInCourseDocument,
    "\n  query GetAllLessonsInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllLessonsInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetAllLessonsInOutletDocument,
    "\n  query GetLessonsForEducator($institutionId: ID!, $educatorId: ID!) {\n    getEducatorById(input: { id: $educatorId, institutionId: $institutionId }) {\n      id\n      courses {\n        id\n        name\n        lessons {\n          id\n          name\n          state\n          lessonStartTimestamptz\n          lessonEndTimestamptz\n        }\n      }\n    }\n  }\n": typeof types.GetLessonsForEducatorDocument,
    "\n  query GetLessonById($institutionId: ID!, $lessonId: ID!) {\n    getLessonById(institutionId: $institutionId, lessonId: $lessonId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n      outlet {\n        id\n        name\n      }\n      outletRoom {\n        id\n        name\n      }\n      educators {\n        id\n        name\n      }\n      students {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      topics {\n        id\n        name\n      }\n      materials {\n        id\n        name\n        fileUrl\n        description\n        topics {\n          id\n          name\n        }\n      }\n      lessonPlans {\n        id\n        plan\n        state\n      }\n      lessonObjectives {\n        id\n        name\n        objective\n      }\n    }\n  }\n": typeof types.GetLessonByIdDocument,
    "\n  query GetAllStudentsInInstitution($institutionId: ID!) {\n    getAllStudentsInInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n    }\n  }\n": typeof types.GetAllStudentsInInstitutionDocument,
    "\n  query GetStudentById($input: GetStudentByIdInput!) {\n    getStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n      courses {\n        id\n        name\n        lessonFrequency\n        courseStartTimestamptz\n        courseEndTimestamptz\n        subjects {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetStudentByIdDocument,
    "\n  query GetAllSubjectsInInstitution($institutionId: ID!) {\n    getAllSubjectsInInstitution(institutionId: $institutionId) {\n      id\n      name\n    }\n  }\n": typeof types.GetAllSubjectsInInstitutionDocument,
};
const documents: Documents = {
    "\n  query GetAccountById($accountId: ID!) {\n    getAccountById(accountId: $accountId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n": types.GetAccountByIdDocument,
    "\n  query GetAccountByUserId($institutionId: ID!, $userId: ID!) {\n    getAccountByUserId(institutionId: $institutionId, userId: $userId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n": types.GetAccountByUserIdDocument,
    "\n  query GetAllAccountsInInstitution($institutionId: ID!) {\n    getAllAccountsInInstitution(institutionId: $institutionId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      parentFeatureState\n      educatorFeatureState\n      staffFeatureState\n    }\n  }\n": types.GetAllAccountsInInstitutionDocument,
    "\n  mutation UpdateEducatorById($input: UpdateEducatorByIdInput!) {\n    updateEducatorById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      startDate\n      employmentType\n    }\n  }\n": types.UpdateEducatorByIdDocument,
    "\n  mutation UpdateParentById($input: UpdateParentByIdInput!) {\n    updateParentById(input: $input) {\n      id\n      relationship\n      profileImageUrl\n    }\n  }\n": types.UpdateParentByIdDocument,
    "\n  mutation RequestAccountProfileImageUpload(\n    $input: RequestAccountProfileImageUploadInput!\n  ) {\n    requestAccountProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": types.RequestAccountProfileImageUploadDocument,
    "\n  mutation ConfirmAccountProfileImageUpload(\n    $input: ConfirmAccountProfileImageUploadInput!\n  ) {\n    confirmAccountProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": types.ConfirmAccountProfileImageUploadDocument,
    "\n  mutation RequestParentProfileImageUpload(\n    $input: RequestParentProfileImageUploadInput!\n  ) {\n    requestParentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": types.RequestParentProfileImageUploadDocument,
    "\n  mutation ConfirmParentProfileImageUpload(\n    $input: ConfirmParentProfileImageUploadInput!\n  ) {\n    confirmParentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": types.ConfirmParentProfileImageUploadDocument,
    "\n  mutation RequestEducatorProfileImageUpload(\n    $input: RequestEducatorProfileImageUploadInput!\n  ) {\n    requestEducatorProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": types.RequestEducatorProfileImageUploadDocument,
    "\n  mutation ConfirmEducatorProfileImageUpload(\n    $input: ConfirmEducatorProfileImageUploadInput!\n  ) {\n    confirmEducatorProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": types.ConfirmEducatorProfileImageUploadDocument,
    "\n  mutation RequestStudentProfileImageUpload(\n    $input: RequestStudentProfileImageUploadInput!\n  ) {\n    requestStudentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n": types.RequestStudentProfileImageUploadDocument,
    "\n  mutation ConfirmStudentProfileImageUpload(\n    $input: ConfirmStudentProfileImageUploadInput!\n  ) {\n    confirmStudentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n": types.ConfirmStudentProfileImageUploadDocument,
    "\n  mutation UpdateStudentById($input: UpdateStudentByIdInput!) {\n    updateStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n    }\n  }\n": types.UpdateStudentByIdDocument,
    "\n  query GetAllCoursesInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllCoursesInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n    }\n  }\n": types.GetAllCoursesInOutletDocument,
    "\n  query GetCourseById($courseId: ID!) {\n    getCourseById(courseId: $courseId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n      educators {\n        id\n        name\n        email\n      }\n      students {\n        id\n        name\n        email\n      }\n      lessons {\n        id\n        name\n        lessonStartTimestamptz\n        lessonEndTimestamptz\n        state\n      }\n    }\n  }\n": types.GetCourseByIdDocument,
    "\n  query GetInstitution($institutionId: ID!) {\n    getInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n": types.GetInstitutionDocument,
    "\n  query GetInstitutionsByIds($institutionIds: [ID!]!) {\n    getInstitutionsByIds(institutionIds: $institutionIds) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n": types.GetInstitutionsByIdsDocument,
    "\n  query GetAllLessonsInCourse($institutionId: ID!, $courseId: ID!) {\n    getAllLessonsInCourse(institutionId: $institutionId, courseId: $courseId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      subjects {\n        id\n        name\n      }\n    }\n  }\n": types.GetAllLessonsInCourseDocument,
    "\n  query GetAllLessonsInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllLessonsInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n    }\n  }\n": types.GetAllLessonsInOutletDocument,
    "\n  query GetLessonsForEducator($institutionId: ID!, $educatorId: ID!) {\n    getEducatorById(input: { id: $educatorId, institutionId: $institutionId }) {\n      id\n      courses {\n        id\n        name\n        lessons {\n          id\n          name\n          state\n          lessonStartTimestamptz\n          lessonEndTimestamptz\n        }\n      }\n    }\n  }\n": types.GetLessonsForEducatorDocument,
    "\n  query GetLessonById($institutionId: ID!, $lessonId: ID!) {\n    getLessonById(institutionId: $institutionId, lessonId: $lessonId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n      outlet {\n        id\n        name\n      }\n      outletRoom {\n        id\n        name\n      }\n      educators {\n        id\n        name\n      }\n      students {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      topics {\n        id\n        name\n      }\n      materials {\n        id\n        name\n        fileUrl\n        description\n        topics {\n          id\n          name\n        }\n      }\n      lessonPlans {\n        id\n        plan\n        state\n      }\n      lessonObjectives {\n        id\n        name\n        objective\n      }\n    }\n  }\n": types.GetLessonByIdDocument,
    "\n  query GetAllStudentsInInstitution($institutionId: ID!) {\n    getAllStudentsInInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n    }\n  }\n": types.GetAllStudentsInInstitutionDocument,
    "\n  query GetStudentById($input: GetStudentByIdInput!) {\n    getStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n      courses {\n        id\n        name\n        lessonFrequency\n        courseStartTimestamptz\n        courseEndTimestamptz\n        subjects {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.GetStudentByIdDocument,
    "\n  query GetAllSubjectsInInstitution($institutionId: ID!) {\n    getAllSubjectsInInstitution(institutionId: $institutionId) {\n      id\n      name\n    }\n  }\n": types.GetAllSubjectsInInstitutionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAccountById($accountId: ID!) {\n    getAccountById(accountId: $accountId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n"): typeof import('./graphql').GetAccountByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAccountByUserId($institutionId: ID!, $userId: ID!) {\n    getAccountByUserId(institutionId: $institutionId, userId: $userId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      educatorFeatureState\n      parentFeatureState\n      staffFeatureState\n      parent {\n        id\n        relationship\n        profileImageUrl\n      }\n      students {\n        id\n        name\n        email\n        dateOfBirth\n        profileImageUrl\n      }\n      educators {\n        id\n        name\n        email\n        employmentType\n        profileImageUrl\n      }\n    }\n  }\n"): typeof import('./graphql').GetAccountByUserIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllAccountsInInstitution($institutionId: ID!) {\n    getAllAccountsInInstitution(institutionId: $institutionId) {\n      id\n      userId\n      firstName\n      lastName\n      status\n      profileImageUrl\n      parentFeatureState\n      educatorFeatureState\n      staffFeatureState\n    }\n  }\n"): typeof import('./graphql').GetAllAccountsInInstitutionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEducatorById($input: UpdateEducatorByIdInput!) {\n    updateEducatorById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      startDate\n      employmentType\n    }\n  }\n"): typeof import('./graphql').UpdateEducatorByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateParentById($input: UpdateParentByIdInput!) {\n    updateParentById(input: $input) {\n      id\n      relationship\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').UpdateParentByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestAccountProfileImageUpload(\n    $input: RequestAccountProfileImageUploadInput!\n  ) {\n    requestAccountProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n"): typeof import('./graphql').RequestAccountProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmAccountProfileImageUpload(\n    $input: ConfirmAccountProfileImageUploadInput!\n  ) {\n    confirmAccountProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').ConfirmAccountProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestParentProfileImageUpload(\n    $input: RequestParentProfileImageUploadInput!\n  ) {\n    requestParentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n"): typeof import('./graphql').RequestParentProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmParentProfileImageUpload(\n    $input: ConfirmParentProfileImageUploadInput!\n  ) {\n    confirmParentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').ConfirmParentProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestEducatorProfileImageUpload(\n    $input: RequestEducatorProfileImageUploadInput!\n  ) {\n    requestEducatorProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n"): typeof import('./graphql').RequestEducatorProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmEducatorProfileImageUpload(\n    $input: ConfirmEducatorProfileImageUploadInput!\n  ) {\n    confirmEducatorProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').ConfirmEducatorProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestStudentProfileImageUpload(\n    $input: RequestStudentProfileImageUploadInput!\n  ) {\n    requestStudentProfileImageUpload(input: $input) {\n      uploadUrl\n      fileKey\n    }\n  }\n"): typeof import('./graphql').RequestStudentProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmStudentProfileImageUpload(\n    $input: ConfirmStudentProfileImageUploadInput!\n  ) {\n    confirmStudentProfileImageUpload(input: $input) {\n      id\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').ConfirmStudentProfileImageUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateStudentById($input: UpdateStudentByIdInput!) {\n    updateStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql').UpdateStudentByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllCoursesInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllCoursesInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllCoursesInOutletDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCourseById($courseId: ID!) {\n    getCourseById(courseId: $courseId) {\n      id\n      name\n      maxSize\n      lessonFrequency\n      courseStartTimestamptz\n      courseEndTimestamptz\n      level {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      priceRecord {\n        id\n        frequency\n        price\n      }\n      educators {\n        id\n        name\n        email\n      }\n      students {\n        id\n        name\n        email\n      }\n      lessons {\n        id\n        name\n        lessonStartTimestamptz\n        lessonEndTimestamptz\n        state\n      }\n    }\n  }\n"): typeof import('./graphql').GetCourseByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitution($institutionId: ID!) {\n    getInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n"): typeof import('./graphql').GetInstitutionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutionsByIds($institutionIds: [ID!]!) {\n    getInstitutionsByIds(institutionIds: $institutionIds) {\n      id\n      name\n      email\n      uen\n      address\n      contactNumber\n      logoUrl\n      profileImageUrl\n      state\n      outlets {\n        id\n        name\n        address\n        email\n        contactNumber\n        postalCode\n        description\n      }\n    }\n  }\n"): typeof import('./graphql').GetInstitutionsByIdsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllLessonsInCourse($institutionId: ID!, $courseId: ID!) {\n    getAllLessonsInCourse(institutionId: $institutionId, courseId: $courseId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      subjects {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllLessonsInCourseDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllLessonsInOutlet($institutionId: ID!, $outletId: ID!) {\n    getAllLessonsInOutlet(institutionId: $institutionId, outletId: $outletId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllLessonsInOutletDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLessonsForEducator($institutionId: ID!, $educatorId: ID!) {\n    getEducatorById(input: { id: $educatorId, institutionId: $institutionId }) {\n      id\n      courses {\n        id\n        name\n        lessons {\n          id\n          name\n          state\n          lessonStartTimestamptz\n          lessonEndTimestamptz\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetLessonsForEducatorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLessonById($institutionId: ID!, $lessonId: ID!) {\n    getLessonById(institutionId: $institutionId, lessonId: $lessonId) {\n      id\n      name\n      description\n      state\n      lessonStartTimestamptz\n      lessonEndTimestamptz\n      course {\n        id\n        name\n      }\n      outlet {\n        id\n        name\n      }\n      outletRoom {\n        id\n        name\n      }\n      educators {\n        id\n        name\n      }\n      students {\n        id\n        name\n      }\n      subjects {\n        id\n        name\n      }\n      topics {\n        id\n        name\n      }\n      materials {\n        id\n        name\n        fileUrl\n        description\n        topics {\n          id\n          name\n        }\n      }\n      lessonPlans {\n        id\n        plan\n        state\n      }\n      lessonObjectives {\n        id\n        name\n        objective\n      }\n    }\n  }\n"): typeof import('./graphql').GetLessonByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllStudentsInInstitution($institutionId: ID!) {\n    getAllStudentsInInstitution(institutionId: $institutionId) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllStudentsInInstitutionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStudentById($input: GetStudentByIdInput!) {\n    getStudentById(input: $input) {\n      id\n      name\n      email\n      dateOfBirth\n      profileImageUrl\n      level {\n        id\n        name\n        category\n      }\n      school {\n        id\n        name\n        schoolCategory\n      }\n      courses {\n        id\n        name\n        lessonFrequency\n        courseStartTimestamptz\n        courseEndTimestamptz\n        subjects {\n          id\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetStudentByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllSubjectsInInstitution($institutionId: ID!) {\n    getAllSubjectsInInstitution(institutionId: $institutionId) {\n      id\n      name\n    }\n  }\n"): typeof import('./graphql').GetAllSubjectsInInstitutionDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
