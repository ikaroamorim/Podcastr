//alterar o zoom com font size do html

import { useEffect } from 'react';

import { GetStaticProps } from 'next';
import Image from 'next/image'
import Link from 'next/link';

import { api } from '../services/api';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from '../styles/home.module.scss';


type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  url: string,
  type: string,
  duration: number,
  durationAsString: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

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
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover" />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar Episódio" />
                </button>
              </li>
            );
          })}

        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover" />
                  </td>

                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>

                  <td>{episode.members}</td>

                  <td style={{ width: 100 }}>{episode.publishedAt}</td>

                  <td>{episode.durationAsString}</td>

                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>

    </div>
  )
}

/**
 * Para server side rendering era utilziado getServerSideProps e ao carregar a página a função abaixo fazia a requisição ao servidor
 * ao alterar para getStaticProps a aplicação serve o mesmo html sem fazer a requisição ao servidor de back end
 * 
 * é necessário passar o revalidate que é de quanto em quanto tempo será necessário revalidar os arquivos.
 */
export const getStaticProps: GetStaticProps = async () => {
  //Utilizando fetch api
  //const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc');

  //utilizando o axios
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      type: episode.file.type,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);


  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
