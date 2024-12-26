import type { Member } from '@/types/member';
import Accordion from '@/components/Accordion';
import Card from '@/components/Card';
import { GRADES } from '@/consts/member';
import { toTypeName } from '@/utils';
import { styled } from 'restyle';

interface Props {
  members: Record<string, Array<Member['public']>>;
}

const ORDER = [...GRADES, 'external', 'alumni'];

const Container = styled('div', {
  padding: '50px 20px',
});

const Grid = styled('div', {
  padding: '20px 20px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 20,
});

export default function MemberListPage({ members }: Props) {
  const sortedMembers = Object.entries(members).sort(([a], [b]) => ORDER.indexOf(a) - ORDER.indexOf(b));

  return (
    <Container>
      {
        sortedMembers.map(([key, member]) => (
          <Accordion key={key} open title={toTypeName(key) ?? key}>
            <Grid>
              {member.map((member) => (
                <Card key={member.uuid} member={member} />
              ))}
            </Grid>
          </Accordion>
        ))
      }
    </Container>
  );
}
