import type { TYPES } from '@/consts/member';
import type { ActiveMember, AlumniMember, ExternalMember, Member, MemberBasePrivateInfo, MemberPublicInfo } from '@/types/member';
import { useCallback, useMemo, useState } from 'react';

export type SetPublicProperty = (key: keyof EditaingMember['public'], value: unknown) => void;
export type SetPrivateProperty = (key: keyof EditaingMember['private'], value: unknown) => void;

export interface EditaingMember {
  public: Omit<
    Partial<ActiveMember>
    & Partial<AlumniMember>
    & Partial<ExternalMember>,
    'type'
  > & { type: typeof TYPES[number]['key'] };
  private: Partial<MemberBasePrivateInfo>;
}

export default function useEditMember(init: Member | MemberPublicInfo) {
  const [editing, setEditing] = useState<EditaingMember>({ private: {}, ...init });

  const setPublicProperty: SetPublicProperty = useCallback((key: keyof EditaingMember['public'], value: unknown) => {
    setEditing((prev) => ({ ...prev, public: { ...prev.public, [key]: value } }));
  }, []);

  const setPrivateProperty: SetPrivateProperty = useCallback((key: keyof EditaingMember['private'], value: unknown) => {
    setEditing((prev) => ({ ...prev, private: { ...prev.private, [key]: value } }));
  }, []);

  const member = useMemo(() => toMember(editing), [editing]);
  return { member, setPublicProperty, setPrivateProperty } as const;
}

function toMember(editing: EditaingMember) {
  const { public: publicInfo, private: privateInfo } = editing;
  const baseInfo = {
    uuid: publicInfo.uuid,
    iconUrl: publicInfo.iconUrl,
    firstName: publicInfo.firstName,
    lastName: publicInfo.lastName,
    firstNameKana: publicInfo.firstNameKana,
    lastNameKana: publicInfo.lastNameKana,
    slackDisplayName: publicInfo.slackDisplayName,
    type: publicInfo.type,
  };

  switch (publicInfo.type) {
    case 'active':
      return {
        private: privateInfo,
        public: {
          ...baseInfo,
          studentId: publicInfo.studentId,
          grade: publicInfo.grade,
          expectedGraduationYear: publicInfo.expectedGraduationYear,
          position: publicInfo.position,
        },
      };

    case 'alumni':
      return {
        private: privateInfo,
        public: {
          ...baseInfo,
          oldPosition: publicInfo.oldPosition,
          graduationYear: publicInfo.graduationYear,
        },
      };

    case 'external':
      return {
        private: privateInfo,
        public: {
          ...baseInfo,
          schoolName: publicInfo.schoolName,
          organization: publicInfo.organization,
          expectedGraduationYear: publicInfo.expectedGraduationYear,
        },
      };
  }
}
