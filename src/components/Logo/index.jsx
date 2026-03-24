import styled from 'styled-components'

const LogoWrapper = styled.div`
    background-color: ${props => props.bgcolor || 'var(--primary-color)'};
    padding: 0.5rem;
    border-radius: 4px;
    ${props => props.shadowbox ? 'box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);' : null}
`

const LogoTextWrapper = styled.div`
    font-family: var(--font-primary);
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    align-items: start;
    letter-spacing: 0.25rem;
`

const Otis = styled.span`
    /* CORREÇÃO: Removido o fallback '||' daqui. 
      props.fontsize agora sempre terá um valor.
    */
    font-size: ${props => props.fontsize}rem;
    font-weight: 800;
    color: ${props => props.txtcolor || 'white'};
    display: block;
    line-height: 1;
`

const Connect = styled.span`
    /* CORREÇÃO: Removido o fallback '||' daqui.
      props.fontsize agora sempre terá um valor.
    */
    font-size: ${props => (props.fontsize * 0.5)}rem;
    font-weight: 700;
    color: ${props => props.txtcolor || 'white'};
    display: block;
    line-height: 1;
`

const StairsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;

const Step = styled.span`
  display: block;
  width: 0.75rem;
  background-color: ${props => props.stepcolor || 'white'};
  border-radius: 1px;

  /* Esta lógica já estava correta e agora é segura, 
    pois props.fontsize sempre será um número.
  */
  &:nth-child(1) {
    height: ${props => props.fontsize * 0.5}rem;
  }
  &:nth-child(2) {
    height: ${props => props.fontsize * 0.75}rem;
  }
  &:nth-child(3) {
    height: ${props => props.fontsize}rem;
  }
`;

export default function Logo({ fontSize = 0.75, bgColor, txtColor, shadowBox=false }) {
  return (
    <LogoWrapper
      className='d-flex align-items-center justify-content-center gap-2'
      bgcolor={bgColor}
      shadowbox={shadowBox}
    >
      <StairsWrapper>
        <Step fontsize={fontSize} stepcolor={txtColor} />
        <Step fontsize={fontSize} stepcolor={txtColor} />
        <Step fontsize={fontSize} stepcolor={txtColor} />
      </StairsWrapper>
      <LogoTextWrapper>
        <Otis fontsize={fontSize} txtcolor={txtColor}>OTIS</Otis>
        <Connect fontsize={fontSize} txtcolor={txtColor}>CONNECT</Connect>
      </LogoTextWrapper>
    </LogoWrapper>
  )
}