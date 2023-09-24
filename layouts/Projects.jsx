import ProjectCardHorizontal from '@/components/ProjectCardHorizontal'
import RepositoryCard from '@/components/RepositoryCard'
import ContentRenderer from '@/components/ContentRenderer'
import Reveal from '@/components/Reveal'

const Layout = ({ projects, github }) => {
  return (
    <div className="mx-auto p-3 md:p-6 lg:p-12">
      <div className="prose prose-headings:mb-4 dark:prose-invert">
        <div class="-mx-3 -mt-3 md:m-0">
          <div class="bg-gradient-to-b from-omega-800 to-omega-800 p-6 pb-2 md:bg-none md:p-0">
            <h3>
              <em>Explore My Open-Source Endeavors</em>
            </h3>
            <p>Discover my open-source projects on Github.</p>
          </div>
          <div class="h-px w-full bg-gradient-to-r from-accent via-beta to-alpha md:bg-none"></div>
        </div>

        <div className="mt-4 grid grid-cols-fluid gap-4 [--tw-fluid-col-min:15rem] md:mt-12 md:gap-6">
          {github?.repositories?.records?.map((item, i) => (
            <Reveal animation="fade-in slide-in-top" delay={i * 100} key={item.name}>
              <RepositoryCard {...item} />
            </Reveal>
          ))}
        </div>
        {/* 
        <h1>Portfolio Under Construction.</h1>
        <p>
          Thank you for visiting my portfolio page! It's currently under active development to
          provide you with a better experience. In the meantime, I invite you to explore my projects
          at &nbsp;
          <a href="https://www.dthree.com.ph/projects" rel="noopener noreferrer" target="_blank">
            https://www.dthree.com.ph/projects
          </a>
          &nbsp; & &nbsp;
          <a href="https://github.com/imat-dev" rel="noopener noreferrer" target="_blank">
            my github account
          </a>
          . I appreciate your patience and interest in my work! You can use this content on your
          portfolio's landing page or wherever you see fit. Adjustments can be made based on your
          design and preferences.
        </p> */}

        <div className="my-6 md:my-20"></div>
        <div class="-mx-3 -mt-5 md:m-0">
          <div class="bg-gradient-to-b from-omega-800 to-omega-800 p-6 pb-2 md:bg-none md:p-0">
            <h3>
              <em>Latest Projects</em>
            </h3>
            <p>
              Thanks for stopping by my portfolio! It's under construction for a better experience.
              Meanwhile, explore my projects at <a href="https://www.dthree.com.ph/projects" rel="noreferrer" target='_blank'>dthree.com.ph/projects.</a>
            </p>
          </div>
          <div class="h-px w-full bg-gradient-to-r from-accent via-beta to-alpha md:bg-none"></div>
        </div>

        <div className="mt-4 grid gap-4 md:mt-12 md:gap-6">
          {projects?.collection?.records?.map((item, i) => (
            <ProjectCardHorizontal key={item.slug} index={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Layout
