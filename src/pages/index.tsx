//alterar o zoom com font size do html

import { useEffect } from "react"

export default function Home(props) {

  /**
   * Use Effect com array vazio executa uma única vez quando o componente é executado
   * seria a estratégia em SPA
   * 
   * useEffect(()=>{
        fetch('http://localhost:3333/episodes')
        .then(response => response.json())
        .then(data => console.log(data))
      }, []);
   */


  return (
    <p>{JSON.stringify(props.episodes)}</p>
  )
}

/**
 * Para server side rendering era utilziado getServerSideProps e ao carregar a página a função abaixo fazia a requisição ao servidor
 * ao alterar para getStaticProps a aplicação serve o mesmo html sem fazer a requisição ao servidor de back end
 * 
 * é necessário passar o revalidate que é de quanto em quanto tempo será necessário revalidar os arquivos.
 */
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60*60*8,
  }
}
