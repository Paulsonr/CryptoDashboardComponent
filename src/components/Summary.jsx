import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-top: 20px;
  height: 450px;
  width: 840px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 24px;
  font-weight: 600;
`;

const Summary = () => {
  return <SectionContainer>Summary content</SectionContainer>;
};

export default Summary;
