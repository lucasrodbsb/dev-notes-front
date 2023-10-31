export const generateColor = (userId: number): string => {
    // Gere uma cor com base no ID do usuário
    const r = (userId * 23) % 256;
    const g = (userId * 7) % 256;
    const b = (userId * 13) % 256;
  
    // Converta os valores em uma string hexadecimal
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  
    return color;
  }