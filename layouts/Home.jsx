import React from 'react'
import classNames from 'clsx'
import ContentRenderer from '@/components/ContentRenderer'
import Image from '@/components/Image'
import Sep from '@/components/Sep'
import Reveal from '@/components/Reveal'
import Companies from '@/components/Companies'
import Typewriter from '@/components/Typewriter'
import Icon from '@/components/Icon'

const HeroPhoto = ({ main }) => (
  <>
    {main.images?.[0] && (
      <div className="with-back-plate hidden md:block">
        <Image
          src={main.images[0].src}
          width={main.images[0].width}
          height={main.images[0].height}
          alt={main.images[0].alt}
          animation="mask-left"
          priority
        />
      </div>
    )}
    {main.images?.[1] && (
      <div className="with-back-plate md:hidden">
        <Image
          src={main.images[1].src}
          width={main.images[1].width}
          height={main.images[1].height}
          alt={main.images[1].alt}
          animation="mask-left"
          priority
        />
      </div>
    )}
  </>
)

const HeroAbout = ({ main }) => (
  <Reveal
    animation="fade-in slide-in-right"
    className={classNames(
      'md:mr-52',
      'prose prose-invert prose-headings:my-4 first-of-type:prose-headings:mt-0 prose-p:hidden',
      'md:prose-headings:my-6 md:prose-p:block'
    )}
  >
    <ContentRenderer source={main} />
  </Reveal>
)

const Achievements = ({ achievements }) => (
  <Reveal
    animation="fade-in slide-in-left"
    className={classNames(
      'prose prose-invert relative z-10 flex flex-wrap md:mt-12',
      'md:bg-gradient-omega-900 md:shadow-2xl'
    )}
  >
    <Sep line className="hidden md:block" />
    {achievements?.map((item, i) => (
      <div
        key={i}
        className="flex flex-1 flex-col items-center justify-center px-1 py-4 md:flex-row md:justify-start md:p-6"
      >
        <h2
          className={classNames(
            'm-0 md:pr-4',
            i === 0 && 'text-accent',
            i === 1 && 'text-beta',
            i >= 2 && 'text-alpha'
          )}
        >
          {item.number}
        </h2>
        <div className="text-white">{item.text}</div>
      </div>
    ))}
  </Reveal>
)

const SkillSet = ({ title, list }) => (
  <div className="bg-gradient-omega-900 p-6 md:px-12 md:py-8">
    <p className="col-span-3 mt-0 mb-6 self-center border-l-2 border-alpha pl-3 text-white">
      {title}
    </p>
    <div className="grid grid-cols-fluid gap-y-3 gap-x-8 [--tw-fluid-col-min:12rem]">
      {list?.map((props, j) => (
        <Reveal key={j} animation="fade-in" delay={j * 200}>
          <Skill {...props} />
        </Reveal>
      ))}
    </div>
  </div>
)

const Skill = ({ title, icon, level }) => (
  <div className="flex items-center">
    {icon && (
      <Icon width={28} height={28} {...icon} className="mr-3 h-7 w-7 fill-current text-omega-500" />
    )}
    <small className="font-bold">{title}</small>
    <div className="ml-auto space-x-px">
      {Array(5)
        .fill(null)
        .map((_, k) => (
          <span
            key={`${title}${k}-f`}
            className={classNames(
              'inline-block h-3.5 w-3.5',
              k + 1 <= level ? 'bg-gradient-to-tr from-accent-700 to-accent' : 'bg-omega-700'
            )}
          />
        ))}
    </div>
  </div>
)

const Layout = ({ main = {}, cta = {}, achievements = [], companies, skills }) => (
  <div className="mx-auto my-auto p-4 md:p-10 lg:p-20">
    <div className="items-center text-center md:flex md:text-left">
      <div className="inline-block shrink-0 md:order-2 md:-ml-40">
        <HeroPhoto main={main} />
      </div>
      <div className="z-10 mt-6 basis-full md:m-0">
        <HeroAbout main={main} />
        <Achievements achievements={achievements} />
        <div className="prose prose-invert mt-6 md:mt-12">
          <ContentRenderer source={cta} />
        </div>
      </div>
    </div>
    {/* <div className="mt-6 mt-12 hidden px-4 md:block">
      <Companies {...companies} />
    </div> */}

    <div className="mt-20  px-4 text-white md:block">
      <div className="mb-12">
        <h3 className="mb-2 text-white">I'm specialized in</h3>
        <h3 className="inline">
          <Typewriter
            lines={['Full-stack Dev', 'NestJS', 'Next.js', 'React', 'Node.js', 'Javascript', 'WordPress', 'E-Commerce']}
            lineClassName="text-gradient-500"
          />
        </h3>
      </div>
      {skills && (
        <div className="grid grid-cols-1 items-start divide-y divide-omega-700 shadow-xl">
          {skills.map((props, i) => (
            <SkillSet key={i} {...props} />
          ))}
        </div>
      )}
      {/* <Reveal animation="fade-in slide-in-top" className="prose p-6 dark:prose-invert md:p-12">
        <ContentRenderer source={personal_info} />
      </Reveal> */}
    </div>
  </div>
)

export default Layout
