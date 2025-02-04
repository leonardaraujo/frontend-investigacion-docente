import styled from 'styled-components';
export const LayoutLoginCard = styled.div`
  width: 600px;
  height: 400px;
  display: grid;
  grid-template-columns: 50% 50%;
`;

export const LayoutLoginCardInput = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 20% 65% 10%;
  background-color: #BDBCC8;
  padding: 20px;
`;
export const LayoutTextInput = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 1fr 2fr;
  color: white;
`;
export const LayoutInputs = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 1fr 1fr;
`;
export const LayoutLoginCardLogo = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ImageLogin = styled.img`
  width:250px;
  height: auto;
`;
