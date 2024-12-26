import type { Member } from '@/types/member';
import { Text } from '@/components/basic';
import { Link } from '@remix-run/react';
import { useMemo } from 'react';
import { styled } from 'restyle';

interface Props {
  member: Member['public'];
}

const CardRoot = styled('article', {
  'width': '100%',
  'boxShadow': '0 0 1px var(--shadow-color)',
  'borderRadius': 'var(--radius-md)',
  'overflow': 'hidden',

  '@media (width <= 500px)': {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
});

const CardLink = styled(Link, {
  'textDecoration': 'none',
  '@media (width <= 500px)': {
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1 / -1',
  },
});

const AspectRatioStyled = styled('div', {
  'overflow': 'hidden',

  '@media (width <= 500px)': {
    height: '150px',
    aspectRatio: '1/1',
  },
  '@media (width > 500px)': {
    aspectRatio: '3/2',
  },
});

const CardThumbnail = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const CardBody = styled('div', {
  'padding': 10,

  '@media (width <= 500px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Card({ member }: Props) {
  const title = useMemo(() => {
    if (member.type === 'active' && member.position) {
      return `${member.lastName} ${member.firstName} (${member.position})`;
    }
    return `${member.lastName} ${member.firstName}`;
  }, [member]);

  const subTitle = useMemo(() => {
    if (member.type === 'active') {
      return `${member.studentId}`;
    } else if (member.type === 'alumni') {
      return `${member.graduationYear}年卒`;
    } else if (member.type === 'external') {
      return member.organization;
    }
  }, [member]);

  return (
    <CardRoot>
      <CardLink to={`/member/${member.uuid}`}>
        <AspectRatioStyled>
          <CardThumbnail alt={member.slackDisplayName} src={member.iconUrl} />
        </AspectRatioStyled>

        <CardBody>
          <div>
            <Text bold size="lg">{title}</Text>
            <Text nowrap overflow="hidden" textOverflow="ellipsis">{subTitle}</Text>
          </div>
        </CardBody>
      </CardLink>
    </CardRoot>
  );
}
