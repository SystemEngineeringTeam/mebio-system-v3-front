import type { PrismaClient } from '@prisma/client';
import { err } from 'neverthrow';

export const MemberRepository = {
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

  listWithSensitive: async (prisma: PrismaClient) => {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        MemberBase: true,
        MemberActive: true,
        MemberActiveInternal: true,
        MemberActiveExternal: true,
        MemberAlumni: true,
        MemberSensitive: true,
        MemberStatus: true,
        PaymentAsApprover: true,
        PaymentAsPayer: true,
        PaymentAsReceiver: true,
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
