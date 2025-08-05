//This component file defines a custom reusable UI card called ClickableMessageCard using Visa Nova’s React design system. It’s designed to display a clickable card with a headline, subtitle, and optional description—often used to represent an item in a list, a suggested component, or a user message. 

import { VisaChevronRightTiny } from '@visa/nova-icons-react';
import {
  ContentCard,
  ContentCardBody,
  ContentCardSubtitle,
  ContentCardTitle,
  Typography,
  Utility,
} from '@visa/nova-react';

type ClickableMessageProp= {
  headline: string;
  subtitle: string;
  description?: React.ReactNode;
};

//description → optional, can be any React node (e.g., text, elements, code block, etc.)
export const ClickableMessageCard = ({
  headline,
  subtitle,
  description,
}: ClickableMessageProp) => {
  return (
    <ContentCard clickable tag='button'>
      <Utility
        element={<ContentCardBody tag='span' />}
        vAlignItems='start'
        vFlex
        vFlexCol
        vGap={4}
      >
        <ContentCardTitle variant='headline-4' tag='span'>
          {headline}
          <VisaChevronRightTiny rtl className='v-icon-move' />
        </ContentCardTitle>
        <ContentCardSubtitle variant='subtitle-3' tag='span'>
          {subtitle}
        </ContentCardSubtitle>
        <Utility element={<Typography tag='span' />} vPaddingTop={4}>
          {description}
        </Utility>
      </Utility>
    </ContentCard>
  );
};