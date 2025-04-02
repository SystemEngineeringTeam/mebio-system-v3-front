import type { MemberCreate } from '@/schemas/member';
import type { PrismaClient } from '@prisma/client';
import { err } from 'neverthrow';

export const MemberRepository = {
  create: async (prisma: PrismaClient, data: MemberCreate) => {
    const member = await prisma.member.create({
      data: {
        email: data.email,
        subject: 'subject',
        securityRole: 'DEFAULT',
        MemberActive: {
          create: {
            grade: data.grade,
          },
        },
        MemberBase: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            firstNameKana: data.firstNameKana,
            lastNameKana: data.lastNameKana,
            iconUrl: data.iconUrl,
          },
        },
        ...(data.type === 'INTERNAL_ACTIVE' && {
          MemberActiveInternal: {
            create: {
              role: data.role ?? null,
              studentId: data.studentId,
            },
          },
        }),
        ...(data.type === 'EXTERNAL_ACTIVE' && {
          MemberActiveExternal: {
            create: {
              schoolName: data.schoolName,
              schoolMajor: data.schoolMajor,
              organization: data.organization,
            },
          },
        }),
        ...((data.type === 'EXTERNAL_ALUMNI' || data.type === 'INTERNAL_ALUMNI') && {
          MemberAlumni: {
            create: {
              graduatedYear: data.graduatedYear,
              oldRole: data.oldRole ?? null,
            },
          },
        }),
      },
    });

    return member;
  },

  list: async (prisma: PrismaClient) => {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        MemberBase: true,
        MemberActive: true,
        MemberActiveInternal: true,
        MemberActiveExternal: true,
        MemberAlumni: true,
      },
    });

    const hasMemberProperties = members.every(
      (m) => {
        if (!m.MemberBase) return false;
        if (!m.MemberActive) return false;

        if (!m.MemberActiveInternal && !m.MemberActiveExternal) return false;

        return true;
      },
    );

    if (!hasMemberProperties) err('Member properties are not valid');

    return members;
  },
};

export type MemberList = Awaited<ReturnType<typeof MemberRepository.list>>;
