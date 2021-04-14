import Head from "next/head";
import TypingTest from "../components/TypingTest";

const TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; //Vestibulum porttitor sem tempor ante malesuada convallis. Proin quis pulvinar arcu."; //Pellentesque eget est lorem. Pellentesque mollis placerat felis. Vestibulum placerat mattis gravida. Aenean vitae libero vitae orci pulvinar accumsan non ut nibh. Cras iaculis luctus sem id placerat. Nulla sed magna ac enim lobortis porttitor ac eget mauris. Donec orci lorem, pharetra nec lectus convallis, lobortis venenatis orci. Phasellus velit libero, tincidunt eget mauris eleifend, posuere malesuada ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Donec ex mauris, finibus rhoncus augue sed, suscipit.";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Typing Test</title>
        <meta charSet="utf-8" />
        <meta name="name" content="" />
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <meta name="author" content="Jason Liu" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <TypingTest text={TEXT} />
    </div>
  );
};

export default Home;
