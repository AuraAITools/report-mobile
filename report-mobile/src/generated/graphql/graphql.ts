/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: any; output: any; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
};

export enum AccountFeature {
  EducatorFeature = 'EDUCATOR_FEATURE',
  ParentFeature = 'PARENT_FEATURE',
  StaffFeature = 'STAFF_FEATURE'
}

/**
 * Minimal projection of an account, used to populate audit fields (createdBy / updatedBy)
 * on every Auditable response. Resolved lazily via @BatchMapping in
 * AccountMinimalDetailGqlController.
 *
 * Only `userId` is guaranteed: it always reflects the Keycloak subject stored by
 * AuditorAwareImpl. The remaining fields are resolved from the matching Account in
 * the current tenant; they are null when no such Account exists (e.g. system-level
 * audits, deleted accounts, or cross-tenant references).
 */
export type AccountMinimalDetail = {
  __typename?: 'AccountMinimalDetail';
  accountId?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** Presigned S3 GET URL for the account's profile image. Null if no image is set. */
  url?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

/**
 * Response from requestAccountProfileImageUpload — the client uses uploadUrl to PUT
 * bytes directly to S3, then passes fileKey back to confirmAccountProfileImageUpload
 * to validate dimensions/size and persist the key on the account.
 */
export type AccountProfileImageUploadResponse = {
  __typename?: 'AccountProfileImageUploadResponse';
  fileKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type AccountResponse = Auditable & {
  __typename?: 'AccountResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  educatorFeatureEnabled: Scalars['Boolean']['output'];
  educators: Array<EducatorResponse>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  parent?: Maybe<ParentResponse>;
  parentFeatureEnabled: Scalars['Boolean']['output'];
  /** Presigned S3 GET URL for the account's profile image. Null if no image is set. */
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  staffFeatureEnabled: Scalars['Boolean']['output'];
  status: AccountStatus;
  students: Array<StudentResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
  userId: Scalars['ID']['output'];
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Retired = 'RETIRED',
  Verifying = 'VERIFYING'
}

export type AccountStudentDetailsInput = {
  courseEnrollments: Array<StudentCourseEnrollmentInput>;
  dateOfBirth: Scalars['Date']['input'];
  email: Scalars['String']['input'];
  levelId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  schoolId: Scalars['ID']['input'];
};

export type Auditable = {
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type ConfirmAccountProfileImageUploadInput = {
  accountId: Scalars['ID']['input'];
  /** The fileKey returned from requestAccountProfileImageUpload, after the PUT completes. */
  fileKey: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
};

export type ConfirmInstitutionProfileImageUploadInput = {
  /** The fileKey returned from requestInstitutionProfileImageUpload, after the PUT completes. */
  fileKey: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
};

export type ConfirmParentProfileImageUploadInput = {
  /** The fileKey returned from requestParentProfileImageUpload, after the PUT completes. */
  fileKey: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  parentId: Scalars['ID']['input'];
};

export type ConfirmStudentProfileImageUploadInput = {
  /** The fileKey returned from requestStudentProfileImageUpload, after the PUT completes. */
  fileKey: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  studentId: Scalars['ID']['input'];
};

export type CourseResponse = Auditable & {
  __typename?: 'CourseResponse';
  courseEndTimestamptz: Scalars['Long']['output'];
  courseStartTimestamptz: Scalars['Long']['output'];
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  educators: Array<EducatorResponse>;
  id: Scalars['ID']['output'];
  lessonFrequency: LessonFrequency;
  lessons: Array<LessonResponse>;
  level?: Maybe<LevelResponse>;
  maxSize: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priceRecord?: Maybe<PriceRecordResponse>;
  students: Array<StudentResponse>;
  subjects: Array<SubjectResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type CreateAccountInput = {
  contact: Scalars['Int']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
};

export type CreateCourseInput = {
  courseEndTimestamptz: Scalars['DateTime']['input'];
  courseStartTimestamptz: Scalars['DateTime']['input'];
  educatorIds: Array<Scalars['ID']['input']>;
  institutionId: Scalars['ID']['input'];
  lessonFrequency: LessonFrequency;
  levelId?: InputMaybe<Scalars['ID']['input']>;
  maxSize: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  outletId: Scalars['ID']['input'];
  priceRecord: CreatePriceRecordInput;
  studentIds: Array<Scalars['ID']['input']>;
  subjectIds: Array<Scalars['ID']['input']>;
};

export type CreateEducatorInput = {
  accountId: Scalars['ID']['input'];
  courseIds: Array<Scalars['ID']['input']>;
  dateOfBirth: Scalars['Date']['input'];
  email: Scalars['String']['input'];
  employmentType: EmploymentType;
  institutionId: Scalars['ID']['input'];
  levelIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  outletIds: Array<Scalars['ID']['input']>;
  startDate: Scalars['Date']['input'];
  subjectIds: Array<Scalars['ID']['input']>;
};

export type CreateEducatorsInput = {
  educators: Array<CreateEducatorInput>;
  institutionId: Scalars['ID']['input'];
};

export type CreateInstitutionInput = {
  address: Scalars['String']['input'];
  contactNumber: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  uen: Scalars['String']['input'];
};

export type CreateLessonInCourseInput = {
  courseId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  educatorIds: Array<Scalars['ID']['input']>;
  institutionId: Scalars['ID']['input'];
  lessonEndTimestamptz: Scalars['DateTime']['input'];
  lessonPlans: Array<CreateLessonPlanForLessonInput>;
  lessonStartTimestamptz: Scalars['DateTime']['input'];
  levelIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  outletRoomId?: InputMaybe<Scalars['ID']['input']>;
  studentIds: Array<Scalars['ID']['input']>;
  subjectIds: Array<Scalars['ID']['input']>;
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateLessonObjectiveInLessonPlanInput = {
  name: Scalars['String']['input'];
  objective: Scalars['String']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateLessonObjectiveInput = {
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
  lessonPlanId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  objective: Scalars['String']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateLessonPlanForLessonInput = {
  lessonObjectives: Array<CreateLessonObjectiveInLessonPlanInput>;
  materialIds: Array<Scalars['ID']['input']>;
  plan: Scalars['String']['input'];
  studentIds: Array<Scalars['ID']['input']>;
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateLessonPlanInLessonInput = {
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
  lessonObjectives: Array<CreateLessonObjectiveInLessonPlanInput>;
  materialIds: Array<Scalars['ID']['input']>;
  plan: Scalars['String']['input'];
  studentIds: Array<Scalars['ID']['input']>;
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateLevelInInstitutionInput = {
  category: School_Category;
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type CreateMaterialInInstitutionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  /** Set to the fileKey returned by requestMaterialUpload if a file was uploaded. Omit for materials without a file. */
  fileKey?: InputMaybe<Scalars['String']['input']>;
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  /** Topics to link the material to. Pass an empty list for no links. */
  topicIds: Array<Scalars['ID']['input']>;
};

export type CreateOutletInput = {
  address: Scalars['String']['input'];
  contactNumber: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  email: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  postalCode: Scalars['Int']['input'];
};

export type CreateOutletRoomInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  outletId: Scalars['ID']['input'];
  passcode?: InputMaybe<Scalars['String']['input']>;
  size: Scalars['Int']['input'];
  type: OutletRoomType;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateParentAndStudentsInAccountInput = {
  accountId: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  relationship: Relationship;
  students: Array<AccountStudentDetailsInput>;
};

export type CreateParentAndStudentsInAccountResponse = {
  __typename?: 'CreateParentAndStudentsInAccountResponse';
  parent: ParentResponse;
  students: Array<StudentResponse>;
};

export type CreateParentInAccountInput = {
  accountId: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  relationship: Relationship;
};

export type CreatePriceRecordInput = {
  frequency: PriceFrequency;
  price: Scalars['Float']['input'];
};

export type CreateSchoolInput = {
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  schoolCategory: SchoolCategory;
};

export type CreateStudentInput = {
  accountId: Scalars['ID']['input'];
  courseEnrollments: Array<StudentCourseEnrollmentInput>;
  dateOfBirth: Scalars['Date']['input'];
  email: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  levelId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  schoolId: Scalars['ID']['input'];
};

export type CreateStudentsInput = {
  institutionId: Scalars['ID']['input'];
  students: Array<CreateStudentInput>;
};

export type CreateSubjectInput = {
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type CreateSubjectTopicLinksInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};

export type DeleteEducatorByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type DeleteLessonObjectiveByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};

export type DeleteMaterialByIdInput = {
  institutionId: Scalars['ID']['input'];
  materialId: Scalars['ID']['input'];
};

export type DeleteOutletRoomByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type DeleteParentByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type DeleteSchoolInInstitutionInput = {
  institutionId: Scalars['ID']['input'];
  schoolId: Scalars['ID']['input'];
};

export type DeleteStudentByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type EducatorResponse = Auditable & {
  __typename?: 'EducatorResponse';
  account: AccountResponse;
  courses: Array<CourseResponse>;
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  dateOfBirth: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  employmentType: EmploymentType;
  id: Scalars['ID']['output'];
  levels: Array<LevelResponse>;
  name: Scalars['String']['output'];
  outlets: Array<OutletResponse>;
  startDate: Scalars['Date']['output'];
  subjects: Array<SubjectResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export enum EmploymentType {
  FullTime = 'FULL_TIME',
  PartTime = 'PART_TIME'
}

export type EnableAccountFeatureInput = {
  accountId: Scalars['ID']['input'];
  feature: AccountFeature;
  institutionId: Scalars['ID']['input'];
};

export type GetEducatorByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type GetParentByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type GetStudentByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};

export type GrantUserGroupRoleInput = {
  institutionId: Scalars['ID']['input'];
  role: UserGroupRole;
  userGroupId: Scalars['ID']['input'];
  userGroupType: UserGroupType;
  userId: Scalars['ID']['input'];
};

/**
 * Response from requestInstitutionProfileImageUpload — the client uses uploadUrl to PUT
 * bytes directly to S3, then passes fileKey back to confirmInstitutionProfileImageUpload
 * to validate dimensions/size and persist the key on the institution.
 */
export type InstitutionProfileImageUploadResponse = {
  __typename?: 'InstitutionProfileImageUploadResponse';
  fileKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type InstitutionResponse = Auditable & {
  __typename?: 'InstitutionResponse';
  address: Scalars['String']['output'];
  contactNumber: Scalars['String']['output'];
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  outlets: Array<OutletResponse>;
  /** Presigned S3 GET URL for the institution's profile image. Null if no image is set. */
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  state: InstitutionState;
  uen: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type InstitutionSearchInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Long']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uen?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Long']['input']>;
};

export enum InstitutionState {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export enum LessonFrequency {
  Fortnightly = 'FORTNIGHTLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

export type LessonObjectiveResponse = Auditable & {
  __typename?: 'LessonObjectiveResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  lessonPlanId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  objective: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type LessonPlanResponse = Auditable & {
  __typename?: 'LessonPlanResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  lesson: LessonResponse;
  plan: Scalars['String']['output'];
  state: LessonPlanState;
  topics: Array<TopicResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export enum LessonPlanState {
  Draft = 'DRAFT',
  Planned = 'PLANNED',
  Unplanned = 'UNPLANNED'
}

export type LessonResponse = Auditable & {
  __typename?: 'LessonResponse';
  course: CourseResponse;
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  description?: Maybe<Scalars['String']['output']>;
  educators: Array<EducatorResponse>;
  id: Scalars['ID']['output'];
  lessonEndTimestamptz: Scalars['Long']['output'];
  lessonObjectives: Array<LessonObjectiveResponse>;
  lessonPlans: Array<LessonPlanResponse>;
  lessonStartTimestamptz: Scalars['Long']['output'];
  levels: Array<LevelResponse>;
  materials: Array<MaterialResponse>;
  name: Scalars['String']['output'];
  outlet: OutletResponse;
  outletRoom?: Maybe<OutletRoomResponse>;
  recap?: Maybe<Scalars['String']['output']>;
  state: LessonState;
  students: Array<StudentResponse>;
  subjects: Array<SubjectResponse>;
  topics: Array<TopicResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export enum LessonState {
  Cancelled = 'CANCELLED',
  Created = 'CREATED',
  Ended = 'ENDED'
}

export type LevelResponse = Auditable & {
  __typename?: 'LevelResponse';
  category: School_Category;
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type LevelResponseConnection = {
  __typename?: 'LevelResponseConnection';
  edges?: Maybe<Array<Maybe<LevelResponseEdge>>>;
  pageInfo: PageInfo;
};

export type LevelResponseEdge = {
  __typename?: 'LevelResponseEdge';
  cursor: Scalars['String']['output'];
  node: LevelResponse;
};

export type LevelSearchInput = {
  createdAt?: InputMaybe<Scalars['Long']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Long']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};

export type MaterialResponse = Auditable & {
  __typename?: 'MaterialResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  description?: Maybe<Scalars['String']['output']>;
  /** Presigned S3 GET URL for the material file. Null if the material has no file. */
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

/**
 * Response from requestMaterialUpload — the client uses uploadUrl to PUT bytes
 * directly to S3, then passes fileKey back to createMaterialInInstitution to
 * persist the material once the upload completes.
 */
export type MaterialUploadResponse = {
  __typename?: 'MaterialUploadResponse';
  fileKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmAccountProfileImageUpload: AccountResponse;
  confirmInstitutionProfileImageUpload: InstitutionResponse;
  confirmParentProfileImageUpload: ParentResponse;
  confirmStudentProfileImageUpload: StudentResponse;
  createAccount: AccountResponse;
  createCourse: CourseResponse;
  createEducatorsInAccount: Array<EducatorResponse>;
  createInstitution: InstitutionResponse;
  createLessonInCourse: LessonResponse;
  createLessonPlanInLesson: LessonPlanResponse;
  createLevelInInstitution: LevelResponse;
  createMaterialInInstitution: MaterialResponse;
  createOutlet: OutletResponse;
  createOutletRoom: OutletRoomResponse;
  createParentAndStudentsInAccount: CreateParentAndStudentsInAccountResponse;
  createParentInAccount: ParentResponse;
  createSchoolInInstitution: SchoolResponse;
  createStudentsInAccount: Array<StudentResponse>;
  createSubject: SubjectResponse;
  createSubjectTopicLinks: SubjectResponseWithTopics;
  createTopic: TopicResponse;
  deleteCourseById: Scalars['Boolean']['output'];
  deleteEducatorById: Scalars['Boolean']['output'];
  deleteLessonById: Scalars['Boolean']['output'];
  deleteLevelById: Scalars['Boolean']['output'];
  deleteMaterialById: Scalars['Boolean']['output'];
  deleteOutletById: Scalars['Boolean']['output'];
  deleteOutletRoomById: Scalars['Boolean']['output'];
  deleteParentById: Scalars['Boolean']['output'];
  deleteSchoolInInstitution: Scalars['Boolean']['output'];
  deleteStudentById: Scalars['Boolean']['output'];
  deleteSubjectById: Scalars['Boolean']['output'];
  deleteTopicById: Scalars['Boolean']['output'];
  enableAccountFeature: AccountResponse;
  grantUserGroupRole: Scalars['Boolean']['output'];
  requestAccountProfileImageUpload: AccountProfileImageUploadResponse;
  requestInstitutionProfileImageUpload: InstitutionProfileImageUploadResponse;
  requestMaterialUpload: MaterialUploadResponse;
  requestParentProfileImageUpload: ParentProfileImageUploadResponse;
  requestStudentProfileImageUpload: StudentProfileImageUploadResponse;
  revokeUserGroupRole: Scalars['Boolean']['output'];
  updateEducatorById: EducatorResponse;
  updateOutlet: OutletResponse;
  updateOutletRoom: OutletRoomResponse;
  updateParentById: ParentResponse;
  updateStudentById: StudentResponse;
};


export type MutationConfirmAccountProfileImageUploadArgs = {
  input: ConfirmAccountProfileImageUploadInput;
};


export type MutationConfirmInstitutionProfileImageUploadArgs = {
  input: ConfirmInstitutionProfileImageUploadInput;
};


export type MutationConfirmParentProfileImageUploadArgs = {
  input: ConfirmParentProfileImageUploadInput;
};


export type MutationConfirmStudentProfileImageUploadArgs = {
  input: ConfirmStudentProfileImageUploadInput;
};


export type MutationCreateAccountArgs = {
  createAccountInput: CreateAccountInput;
};


export type MutationCreateCourseArgs = {
  createCourseInput: CreateCourseInput;
};


export type MutationCreateEducatorsInAccountArgs = {
  createEducatorsInput: CreateEducatorsInput;
};


export type MutationCreateInstitutionArgs = {
  createInstitutionInput: CreateInstitutionInput;
};


export type MutationCreateLessonInCourseArgs = {
  createLessonInCourse: CreateLessonInCourseInput;
};


export type MutationCreateLessonPlanInLessonArgs = {
  input: CreateLessonPlanInLessonInput;
};


export type MutationCreateLevelInInstitutionArgs = {
  input: CreateLevelInInstitutionInput;
};


export type MutationCreateMaterialInInstitutionArgs = {
  input: CreateMaterialInInstitutionInput;
};


export type MutationCreateOutletArgs = {
  createOutletInput: CreateOutletInput;
};


export type MutationCreateOutletRoomArgs = {
  createOutletRoomInput: CreateOutletRoomInput;
};


export type MutationCreateParentAndStudentsInAccountArgs = {
  createParentAndStudentsInAccountInput: CreateParentAndStudentsInAccountInput;
};


export type MutationCreateParentInAccountArgs = {
  createParentInAccountInput: CreateParentInAccountInput;
};


export type MutationCreateSchoolInInstitutionArgs = {
  createSchoolInput: CreateSchoolInput;
};


export type MutationCreateStudentsInAccountArgs = {
  createStudentsInput: CreateStudentsInput;
};


export type MutationCreateSubjectArgs = {
  createSubjectInput: CreateSubjectInput;
};


export type MutationCreateSubjectTopicLinksArgs = {
  createSubjectTopicLinksInput: CreateSubjectTopicLinksInput;
};


export type MutationCreateTopicArgs = {
  topicInput: TopicInput;
};


export type MutationDeleteCourseByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEducatorByIdArgs = {
  input: DeleteEducatorByIdInput;
};


export type MutationDeleteLessonByIdArgs = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type MutationDeleteLevelByIdArgs = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type MutationDeleteMaterialByIdArgs = {
  deleteMaterialByIdInput: DeleteMaterialByIdInput;
};


export type MutationDeleteOutletByIdArgs = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type MutationDeleteOutletRoomByIdArgs = {
  deleteOutletRoomByIdInput: DeleteOutletRoomByIdInput;
};


export type MutationDeleteParentByIdArgs = {
  input: DeleteParentByIdInput;
};


export type MutationDeleteSchoolInInstitutionArgs = {
  deleteSchoolInInstitutionInput: DeleteSchoolInInstitutionInput;
};


export type MutationDeleteStudentByIdArgs = {
  input: DeleteStudentByIdInput;
};


export type MutationDeleteSubjectByIdArgs = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type MutationDeleteTopicByIdArgs = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type MutationEnableAccountFeatureArgs = {
  enableAccountFeatureInput: EnableAccountFeatureInput;
};


export type MutationGrantUserGroupRoleArgs = {
  input: GrantUserGroupRoleInput;
};


export type MutationRequestAccountProfileImageUploadArgs = {
  input: RequestAccountProfileImageUploadInput;
};


export type MutationRequestInstitutionProfileImageUploadArgs = {
  input: RequestInstitutionProfileImageUploadInput;
};


export type MutationRequestMaterialUploadArgs = {
  input: RequestMaterialUploadInput;
};


export type MutationRequestParentProfileImageUploadArgs = {
  input: RequestParentProfileImageUploadInput;
};


export type MutationRequestStudentProfileImageUploadArgs = {
  input: RequestStudentProfileImageUploadInput;
};


export type MutationRevokeUserGroupRoleArgs = {
  input: RevokeUserGroupRoleInput;
};


export type MutationUpdateEducatorByIdArgs = {
  input: UpdateEducatorByIdInput;
};


export type MutationUpdateOutletArgs = {
  updateOutletInput: UpdateOutletInput;
};


export type MutationUpdateOutletRoomArgs = {
  updateOutletRoomInput: UpdateOutletRoomInput;
};


export type MutationUpdateParentByIdArgs = {
  input: UpdateParentByIdInput;
};


export type MutationUpdateStudentByIdArgs = {
  input: UpdateStudentByIdInput;
};

export type OutletResponse = Auditable & {
  __typename?: 'OutletResponse';
  address: Scalars['String']['output'];
  contactNumber: Scalars['Int']['output'];
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  description: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  postalCode: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type OutletResponseConnection = {
  __typename?: 'OutletResponseConnection';
  edges?: Maybe<Array<Maybe<OutletResponseEdge>>>;
  pageInfo: PageInfo;
};

export type OutletResponseEdge = {
  __typename?: 'OutletResponseEdge';
  cursor: Scalars['String']['output'];
  node: OutletResponse;
};

export type OutletRoomResponse = Auditable & {
  __typename?: 'OutletRoomResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  outletId: Scalars['ID']['output'];
  passcode?: Maybe<Scalars['String']['output']>;
  size: Scalars['Int']['output'];
  type: OutletRoomType;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum OutletRoomType {
  Physical = 'PHYSICAL',
  Virtual = 'VIRTUAL'
}

export type OutletSearchInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Long']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Long']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/**
 * Response from requestParentProfileImageUpload — the client uses uploadUrl to PUT bytes
 * directly to S3, then passes fileKey back to confirmParentProfileImageUpload to
 * validate dimensions/size and persist the key on the parent.
 */
export type ParentProfileImageUploadResponse = {
  __typename?: 'ParentProfileImageUploadResponse';
  fileKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type ParentResponse = Auditable & {
  __typename?: 'ParentResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  /** Presigned S3 GET URL for the parent's profile image. Null if no image is set. */
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  relationship: Relationship;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export enum PriceFrequency {
  Monthly = 'MONTHLY',
  PerLesson = 'PER_LESSON',
  Total = 'TOTAL',
  Weekly = 'WEEKLY'
}

export type PriceRecordResponse = {
  __typename?: 'PriceRecordResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  frequency: PriceFrequency;
  id: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type Query = {
  __typename?: 'Query';
  getAccountById: AccountResponse;
  getAccountByUserId: AccountResponse;
  getAllAccountsInInstitution: Array<AccountResponse>;
  getAllCoursesInOutlet: Array<CourseResponse>;
  getAllEducatorsInInstitution: Array<EducatorResponse>;
  getAllLessonsInCourse: Array<LessonResponse>;
  getAllLessonsInOutlet: Array<LessonResponse>;
  getAllOutletRoomsByIds: Array<OutletRoomResponse>;
  getAllOutletRoomsInInstitution: Array<OutletRoomResponse>;
  getAllOutletRoomsInOutlet: Array<OutletRoomResponse>;
  getAllParentsInInstitution: Array<ParentResponse>;
  getAllStudentsInInstitution: Array<StudentResponse>;
  getAllSubjectsInInstitution: Array<SubjectResponse>;
  getAllTopicsInInstitution: Array<TopicResponse>;
  getCourseById: CourseResponse;
  getEducatorById: EducatorResponse;
  getInstitution: InstitutionResponse;
  getInstitutionsByIds: Array<InstitutionResponse>;
  getLessonById: LessonResponse;
  getLevelByIdInInstitution: LevelResponse;
  getLevelByPage: LevelResponseConnection;
  getLevelsInInstitution: Array<LevelResponse>;
  getMaterialById: MaterialResponse;
  getMaterialsInInstitution: Array<MaterialResponse>;
  getOutletsByPage: OutletResponseConnection;
  getOutletsInInstitution: Array<OutletResponse>;
  getParentById: ParentResponse;
  getSchoolsInInstitution: Array<SchoolResponse>;
  getStudentById: StudentResponse;
  getSubjectById: SubjectResponse;
  getTopicById: TopicResponse;
  lookupPermissions: UserPermissions;
};


export type QueryGetAccountByIdArgs = {
  accountId: Scalars['ID']['input'];
};


export type QueryGetAccountByUserIdArgs = {
  institutionId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetAllAccountsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllCoursesInOutletArgs = {
  institutionId: Scalars['ID']['input'];
  outletId: Scalars['ID']['input'];
};


export type QueryGetAllEducatorsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllLessonsInCourseArgs = {
  courseId: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllLessonsInOutletArgs = {
  institutionId: Scalars['ID']['input'];
  outletId: Scalars['ID']['input'];
};


export type QueryGetAllOutletRoomsByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllOutletRoomsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllOutletRoomsInOutletArgs = {
  institutionId: Scalars['ID']['input'];
  outletId: Scalars['ID']['input'];
};


export type QueryGetAllParentsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllStudentsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllSubjectsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetAllTopicsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetCourseByIdArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryGetEducatorByIdArgs = {
  input: GetEducatorByIdInput;
};


export type QueryGetInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetInstitutionsByIdsArgs = {
  institutionIds: Array<Scalars['ID']['input']>;
};


export type QueryGetLessonByIdArgs = {
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};


export type QueryGetLevelByIdInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
  levelId: Scalars['ID']['input'];
};


export type QueryGetLevelByPageArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  institutionId: Scalars['ID']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<LevelSearchInput>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetLevelsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetMaterialByIdArgs = {
  institutionId: Scalars['ID']['input'];
  materialId: Scalars['ID']['input'];
};


export type QueryGetMaterialsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetOutletsByPageArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  institutionId: Scalars['ID']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<OutletSearchInput>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetOutletsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetParentByIdArgs = {
  input: GetParentByIdInput;
};


export type QueryGetSchoolsInInstitutionArgs = {
  institutionId: Scalars['ID']['input'];
};


export type QueryGetStudentByIdArgs = {
  input: GetStudentByIdInput;
};


export type QueryGetSubjectByIdArgs = {
  institutionId: Scalars['ID']['input'];
  subjectId: Scalars['ID']['input'];
};


export type QueryGetTopicByIdArgs = {
  institutionId: Scalars['ID']['input'];
  topicId: Scalars['ID']['input'];
};

export enum Relationship {
  Parent = 'PARENT',
  Self = 'SELF'
}

export type RequestAccountProfileImageUploadInput = {
  accountId: Scalars['ID']['input'];
  /** Must be one of: image/png, image/jpeg, image/webp. */
  contentType: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
};

export type RequestInstitutionProfileImageUploadInput = {
  /** Must be one of: image/png, image/jpeg, image/webp. */
  contentType: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
};

export type RequestMaterialUploadInput = {
  contentType: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
};

export type RequestParentProfileImageUploadInput = {
  /** Must be one of: image/png, image/jpeg, image/webp. */
  contentType: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  parentId: Scalars['ID']['input'];
};

export type RequestStudentProfileImageUploadInput = {
  /** Must be one of: image/png, image/jpeg, image/webp. */
  contentType: Scalars['String']['input'];
  institutionId: Scalars['ID']['input'];
  studentId: Scalars['ID']['input'];
};

export type ResourcePermissions = {
  __typename?: 'ResourcePermissions';
  permissions: Array<Scalars['String']['output']>;
  resourceId: Scalars['String']['output'];
  resourceType: Scalars['String']['output'];
};

export type RevokeUserGroupRoleInput = {
  institutionId: Scalars['ID']['input'];
  role: UserGroupRole;
  userGroupId: Scalars['ID']['input'];
  userGroupType: UserGroupType;
  userId: Scalars['ID']['input'];
};

export enum School_Category {
  Arts = 'ARTS',
  International = 'INTERNATIONAL',
  JuniorCollege = 'JUNIOR_COLLEGE',
  Polytechnic = 'POLYTECHNIC',
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Technical = 'TECHNICAL',
  University = 'UNIVERSITY'
}

export enum SchoolCategory {
  Arts = 'ARTS',
  International = 'INTERNATIONAL',
  JuniorCollege = 'JUNIOR_COLLEGE',
  Polytechnic = 'POLYTECHNIC',
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Technical = 'TECHNICAL',
  University = 'UNIVERSITY'
}

export type SchoolResponse = Auditable & {
  __typename?: 'SchoolResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  schoolCategory: SchoolCategory;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type SortInput = {
  direction: SortDirection;
  field: Scalars['String']['input'];
};

export type StudentCourseEnrollmentInput = {
  courseId: Scalars['ID']['input'];
  startDate: Scalars['Date']['input'];
};

/**
 * Response from requestStudentProfileImageUpload — the client uses uploadUrl to PUT bytes
 * directly to S3, then passes fileKey back to confirmStudentProfileImageUpload to
 * validate dimensions/size and persist the key on the student.
 */
export type StudentProfileImageUploadResponse = {
  __typename?: 'StudentProfileImageUploadResponse';
  fileKey: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type StudentResponse = Auditable & {
  __typename?: 'StudentResponse';
  courses: Array<CourseResponse>;
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  dateOfBirth: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  level: LevelResponse;
  name: Scalars['String']['output'];
  /** Presigned S3 GET URL for the student's profile image. Null if no image is set. */
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  school: SchoolResponse;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type SubjectResponse = Auditable & {
  __typename?: 'SubjectResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  topics: Array<TopicResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type SubjectResponseWithTopics = {
  __typename?: 'SubjectResponseWithTopics';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  topics: Array<TopicResponse>;
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type TopicInput = {
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type TopicResponse = Auditable & {
  __typename?: 'TopicResponse';
  createdAt: Scalars['Long']['output'];
  createdBy: AccountMinimalDetail;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Long']['output']>;
  updatedBy?: Maybe<AccountMinimalDetail>;
};

export type UpdateEducatorByIdInput = {
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employmentType?: InputMaybe<EmploymentType>;
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateLessonObjectiveInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  objective: Scalars['String']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};

export type UpdateOutletInput = {
  address: Scalars['String']['input'];
  contactNumber: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  postalCode: Scalars['Int']['input'];
};

export type UpdateOutletRoomInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  passcode?: InputMaybe<Scalars['String']['input']>;
  size: Scalars['Int']['input'];
  type: OutletRoomType;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateParentByIdInput = {
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  relationship?: InputMaybe<Relationship>;
};

export type UpdateStudentByIdInput = {
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  institutionId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum UserGroupRole {
  Admin = 'ADMIN',
  GroupAdmin = 'GROUP_ADMIN',
  GroupViewer = 'GROUP_VIEWER',
  Modifier = 'MODIFIER',
  Viewer = 'VIEWER'
}

export enum UserGroupType {
  AccountUserGroup = 'ACCOUNT_USER_GROUP',
  CourseUserGroup = 'COURSE_USER_GROUP',
  InstitutionUserGroup = 'INSTITUTION_USER_GROUP',
  LessonUserGroup = 'LESSON_USER_GROUP',
  OutletUserGroup = 'OUTLET_USER_GROUP',
  SystemUserGroup = 'SYSTEM_USER_GROUP'
}

export type UserPermissions = {
  __typename?: 'UserPermissions';
  permissions: Array<ResourcePermissions>;
};

export type GetAccountByIdQueryVariables = Exact<{
  accountId: Scalars['ID']['input'];
}>;


export type GetAccountByIdQuery = { __typename?: 'Query', getAccountById: { __typename?: 'AccountResponse', id: string, userId: string, firstName: string, lastName: string, status: AccountStatus, profileImageUrl?: string | null, educatorFeatureEnabled: boolean, parentFeatureEnabled: boolean, staffFeatureEnabled: boolean, parent?: { __typename?: 'ParentResponse', id: string, relationship: Relationship, profileImageUrl?: string | null } | null, students: Array<{ __typename?: 'StudentResponse', id: string, name: string, email: string, dateOfBirth: any, profileImageUrl?: string | null }>, educators: Array<{ __typename?: 'EducatorResponse', id: string, name: string, email: string, employmentType: EmploymentType }> } };

export type GetAccountByUserIdQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type GetAccountByUserIdQuery = { __typename?: 'Query', getAccountByUserId: { __typename?: 'AccountResponse', id: string, userId: string, firstName: string, lastName: string, status: AccountStatus, profileImageUrl?: string | null, educatorFeatureEnabled: boolean, parentFeatureEnabled: boolean, staffFeatureEnabled: boolean, parent?: { __typename?: 'ParentResponse', id: string, relationship: Relationship, profileImageUrl?: string | null } | null, students: Array<{ __typename?: 'StudentResponse', id: string, name: string, email: string, dateOfBirth: any, profileImageUrl?: string | null }>, educators: Array<{ __typename?: 'EducatorResponse', id: string, name: string, email: string, employmentType: EmploymentType }> } };

export type GetAllAccountsInInstitutionQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
}>;


export type GetAllAccountsInInstitutionQuery = { __typename?: 'Query', getAllAccountsInInstitution: Array<{ __typename?: 'AccountResponse', id: string, userId: string, firstName: string, lastName: string, status: AccountStatus, profileImageUrl?: string | null, parentFeatureEnabled: boolean, educatorFeatureEnabled: boolean, staffFeatureEnabled: boolean }> };

export type GetAllCoursesInOutletQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
  outletId: Scalars['ID']['input'];
}>;


export type GetAllCoursesInOutletQuery = { __typename?: 'Query', getAllCoursesInOutlet: Array<{ __typename?: 'CourseResponse', id: string, name: string, maxSize: number, lessonFrequency: LessonFrequency, courseStartTimestamptz: any, courseEndTimestamptz: any, level?: { __typename?: 'LevelResponse', id: string, name: string } | null, subjects: Array<{ __typename?: 'SubjectResponse', id: string, name: string }>, priceRecord?: { __typename?: 'PriceRecordResponse', id: string, frequency: PriceFrequency, price: number } | null }> };

export type GetCourseByIdQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type GetCourseByIdQuery = { __typename?: 'Query', getCourseById: { __typename?: 'CourseResponse', id: string, name: string, maxSize: number, lessonFrequency: LessonFrequency, courseStartTimestamptz: any, courseEndTimestamptz: any, level?: { __typename?: 'LevelResponse', id: string, name: string } | null, subjects: Array<{ __typename?: 'SubjectResponse', id: string, name: string }>, priceRecord?: { __typename?: 'PriceRecordResponse', id: string, frequency: PriceFrequency, price: number } | null, educators: Array<{ __typename?: 'EducatorResponse', id: string, name: string, email: string }>, students: Array<{ __typename?: 'StudentResponse', id: string, name: string, email: string }>, lessons: Array<{ __typename?: 'LessonResponse', id: string, name: string, lessonStartTimestamptz: any, lessonEndTimestamptz: any, state: LessonState }> } };

export type GetInstitutionQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
}>;


export type GetInstitutionQuery = { __typename?: 'Query', getInstitution: { __typename?: 'InstitutionResponse', id: string, name: string, email: string, uen: string, address: string, contactNumber: string, logoUrl?: string | null, profileImageUrl?: string | null, state: InstitutionState, outlets: Array<{ __typename?: 'OutletResponse', id: string, name: string, address: string, email: string, contactNumber: number, postalCode: number, description: string }> } };

export type GetInstitutionsByIdsQueryVariables = Exact<{
  institutionIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetInstitutionsByIdsQuery = { __typename?: 'Query', getInstitutionsByIds: Array<{ __typename?: 'InstitutionResponse', id: string, name: string, email: string, uen: string, address: string, contactNumber: string, logoUrl?: string | null, profileImageUrl?: string | null, state: InstitutionState, outlets: Array<{ __typename?: 'OutletResponse', id: string, name: string, address: string, email: string, contactNumber: number, postalCode: number, description: string }> }> };

export type GetAllLessonsInCourseQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
  courseId: Scalars['ID']['input'];
}>;


export type GetAllLessonsInCourseQuery = { __typename?: 'Query', getAllLessonsInCourse: Array<{ __typename?: 'LessonResponse', id: string, name: string, description?: string | null, state: LessonState, lessonStartTimestamptz: any, lessonEndTimestamptz: any, recap?: string | null, subjects: Array<{ __typename?: 'SubjectResponse', id: string, name: string }> }> };

export type GetAllLessonsInOutletQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
  outletId: Scalars['ID']['input'];
}>;


export type GetAllLessonsInOutletQuery = { __typename?: 'Query', getAllLessonsInOutlet: Array<{ __typename?: 'LessonResponse', id: string, name: string, description?: string | null, state: LessonState, lessonStartTimestamptz: any, lessonEndTimestamptz: any, course: { __typename?: 'CourseResponse', id: string, name: string } }> };

export type GetLessonByIdQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
}>;


export type GetLessonByIdQuery = { __typename?: 'Query', getLessonById: { __typename?: 'LessonResponse', id: string, name: string, description?: string | null, state: LessonState, lessonStartTimestamptz: any, lessonEndTimestamptz: any, recap?: string | null, course: { __typename?: 'CourseResponse', id: string, name: string }, outlet: { __typename?: 'OutletResponse', id: string, name: string }, outletRoom?: { __typename?: 'OutletRoomResponse', id: string, name: string } | null, educators: Array<{ __typename?: 'EducatorResponse', id: string, name: string }>, students: Array<{ __typename?: 'StudentResponse', id: string, name: string }>, subjects: Array<{ __typename?: 'SubjectResponse', id: string, name: string }>, topics: Array<{ __typename?: 'TopicResponse', id: string, name: string }>, materials: Array<{ __typename?: 'MaterialResponse', id: string, name: string, fileUrl?: string | null, description?: string | null }>, lessonPlans: Array<{ __typename?: 'LessonPlanResponse', id: string, plan: string, state: LessonPlanState }>, lessonObjectives: Array<{ __typename?: 'LessonObjectiveResponse', id: string, name: string, objective: string }> } };

export type GetAllStudentsInInstitutionQueryVariables = Exact<{
  institutionId: Scalars['ID']['input'];
}>;


export type GetAllStudentsInInstitutionQuery = { __typename?: 'Query', getAllStudentsInInstitution: Array<{ __typename?: 'StudentResponse', id: string, name: string, email: string, dateOfBirth: any, profileImageUrl?: string | null, level: { __typename?: 'LevelResponse', id: string, name: string, category: School_Category }, school: { __typename?: 'SchoolResponse', id: string, name: string, schoolCategory: SchoolCategory } }> };

export type GetStudentByIdQueryVariables = Exact<{
  input: GetStudentByIdInput;
}>;


export type GetStudentByIdQuery = { __typename?: 'Query', getStudentById: { __typename?: 'StudentResponse', id: string, name: string, email: string, dateOfBirth: any, profileImageUrl?: string | null, level: { __typename?: 'LevelResponse', id: string, name: string, category: School_Category }, school: { __typename?: 'SchoolResponse', id: string, name: string, schoolCategory: SchoolCategory }, courses: Array<{ __typename?: 'CourseResponse', id: string, name: string, lessonFrequency: LessonFrequency, courseStartTimestamptz: any, courseEndTimestamptz: any, subjects: Array<{ __typename?: 'SubjectResponse', id: string, name: string }> }> } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetAccountByIdDocument = new TypedDocumentString(`
    query GetAccountById($accountId: ID!) {
  getAccountById(accountId: $accountId) {
    id
    userId
    firstName
    lastName
    status
    profileImageUrl
    educatorFeatureEnabled
    parentFeatureEnabled
    staffFeatureEnabled
    parent {
      id
      relationship
      profileImageUrl
    }
    students {
      id
      name
      email
      dateOfBirth
      profileImageUrl
    }
    educators {
      id
      name
      email
      employmentType
    }
  }
}
    `) as unknown as TypedDocumentString<GetAccountByIdQuery, GetAccountByIdQueryVariables>;
export const GetAccountByUserIdDocument = new TypedDocumentString(`
    query GetAccountByUserId($institutionId: ID!, $userId: ID!) {
  getAccountByUserId(institutionId: $institutionId, userId: $userId) {
    id
    userId
    firstName
    lastName
    status
    profileImageUrl
    educatorFeatureEnabled
    parentFeatureEnabled
    staffFeatureEnabled
    parent {
      id
      relationship
      profileImageUrl
    }
    students {
      id
      name
      email
      dateOfBirth
      profileImageUrl
    }
    educators {
      id
      name
      email
      employmentType
    }
  }
}
    `) as unknown as TypedDocumentString<GetAccountByUserIdQuery, GetAccountByUserIdQueryVariables>;
export const GetAllAccountsInInstitutionDocument = new TypedDocumentString(`
    query GetAllAccountsInInstitution($institutionId: ID!) {
  getAllAccountsInInstitution(institutionId: $institutionId) {
    id
    userId
    firstName
    lastName
    status
    profileImageUrl
    parentFeatureEnabled
    educatorFeatureEnabled
    staffFeatureEnabled
  }
}
    `) as unknown as TypedDocumentString<GetAllAccountsInInstitutionQuery, GetAllAccountsInInstitutionQueryVariables>;
export const GetAllCoursesInOutletDocument = new TypedDocumentString(`
    query GetAllCoursesInOutlet($institutionId: ID!, $outletId: ID!) {
  getAllCoursesInOutlet(institutionId: $institutionId, outletId: $outletId) {
    id
    name
    maxSize
    lessonFrequency
    courseStartTimestamptz
    courseEndTimestamptz
    level {
      id
      name
    }
    subjects {
      id
      name
    }
    priceRecord {
      id
      frequency
      price
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllCoursesInOutletQuery, GetAllCoursesInOutletQueryVariables>;
export const GetCourseByIdDocument = new TypedDocumentString(`
    query GetCourseById($courseId: ID!) {
  getCourseById(courseId: $courseId) {
    id
    name
    maxSize
    lessonFrequency
    courseStartTimestamptz
    courseEndTimestamptz
    level {
      id
      name
    }
    subjects {
      id
      name
    }
    priceRecord {
      id
      frequency
      price
    }
    educators {
      id
      name
      email
    }
    students {
      id
      name
      email
    }
    lessons {
      id
      name
      lessonStartTimestamptz
      lessonEndTimestamptz
      state
    }
  }
}
    `) as unknown as TypedDocumentString<GetCourseByIdQuery, GetCourseByIdQueryVariables>;
export const GetInstitutionDocument = new TypedDocumentString(`
    query GetInstitution($institutionId: ID!) {
  getInstitution(institutionId: $institutionId) {
    id
    name
    email
    uen
    address
    contactNumber
    logoUrl
    profileImageUrl
    state
    outlets {
      id
      name
      address
      email
      contactNumber
      postalCode
      description
    }
  }
}
    `) as unknown as TypedDocumentString<GetInstitutionQuery, GetInstitutionQueryVariables>;
export const GetInstitutionsByIdsDocument = new TypedDocumentString(`
    query GetInstitutionsByIds($institutionIds: [ID!]!) {
  getInstitutionsByIds(institutionIds: $institutionIds) {
    id
    name
    email
    uen
    address
    contactNumber
    logoUrl
    profileImageUrl
    state
    outlets {
      id
      name
      address
      email
      contactNumber
      postalCode
      description
    }
  }
}
    `) as unknown as TypedDocumentString<GetInstitutionsByIdsQuery, GetInstitutionsByIdsQueryVariables>;
export const GetAllLessonsInCourseDocument = new TypedDocumentString(`
    query GetAllLessonsInCourse($institutionId: ID!, $courseId: ID!) {
  getAllLessonsInCourse(institutionId: $institutionId, courseId: $courseId) {
    id
    name
    description
    state
    lessonStartTimestamptz
    lessonEndTimestamptz
    recap
    subjects {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllLessonsInCourseQuery, GetAllLessonsInCourseQueryVariables>;
export const GetAllLessonsInOutletDocument = new TypedDocumentString(`
    query GetAllLessonsInOutlet($institutionId: ID!, $outletId: ID!) {
  getAllLessonsInOutlet(institutionId: $institutionId, outletId: $outletId) {
    id
    name
    description
    state
    lessonStartTimestamptz
    lessonEndTimestamptz
    course {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllLessonsInOutletQuery, GetAllLessonsInOutletQueryVariables>;
export const GetLessonByIdDocument = new TypedDocumentString(`
    query GetLessonById($institutionId: ID!, $lessonId: ID!) {
  getLessonById(institutionId: $institutionId, lessonId: $lessonId) {
    id
    name
    description
    state
    lessonStartTimestamptz
    lessonEndTimestamptz
    recap
    course {
      id
      name
    }
    outlet {
      id
      name
    }
    outletRoom {
      id
      name
    }
    educators {
      id
      name
    }
    students {
      id
      name
    }
    subjects {
      id
      name
    }
    topics {
      id
      name
    }
    materials {
      id
      name
      fileUrl
      description
    }
    lessonPlans {
      id
      plan
      state
    }
    lessonObjectives {
      id
      name
      objective
    }
  }
}
    `) as unknown as TypedDocumentString<GetLessonByIdQuery, GetLessonByIdQueryVariables>;
export const GetAllStudentsInInstitutionDocument = new TypedDocumentString(`
    query GetAllStudentsInInstitution($institutionId: ID!) {
  getAllStudentsInInstitution(institutionId: $institutionId) {
    id
    name
    email
    dateOfBirth
    profileImageUrl
    level {
      id
      name
      category
    }
    school {
      id
      name
      schoolCategory
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllStudentsInInstitutionQuery, GetAllStudentsInInstitutionQueryVariables>;
export const GetStudentByIdDocument = new TypedDocumentString(`
    query GetStudentById($input: GetStudentByIdInput!) {
  getStudentById(input: $input) {
    id
    name
    email
    dateOfBirth
    profileImageUrl
    level {
      id
      name
      category
    }
    school {
      id
      name
      schoolCategory
    }
    courses {
      id
      name
      lessonFrequency
      courseStartTimestamptz
      courseEndTimestamptz
      subjects {
        id
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetStudentByIdQuery, GetStudentByIdQueryVariables>;