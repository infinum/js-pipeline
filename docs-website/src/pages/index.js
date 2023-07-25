import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { Hero, ImageAndText, CtaCards, TextCards, FeatureShowcase, CtaImageButton, icons } from '@infinum/docusaurus-theme';

export default function Home() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;

	return (
		<Layout
			title={siteConfig.title}
			description={siteConfig.tagline}
			keywords={siteConfig.customFields.keywords}
			metaImage={useBaseUrl(`img/${siteConfig.customFields.image}`)}
			wrapperClassName='es-footer-white'
		>
			<Hero
				title='Infinum JS Pipeline'
				subtitle='A GitHub Action Pipeline for JavaScript projects'
				buttonLabel='Get started'
				buttonUrl='/js-pipeline/docs/example'
				imageUrl='/js-pipeline/img/logo.svg'
				gray
			/>

			<TextCards
				title='Wide project support'
				subtitle="The JS Pipeline supports wide varity of projects. It doesn't matter if you are using React, Angular or any other framework, the JS Pipeline will work for you."
				cards={[
					{
						title: 'Next.js',
						subtitle: "Tailored for Next.js projects. It's fast and it's easy to use.",
					},
          {
            title: 'React',
            subtitle: "Altrough it's tailored for Next.js, it can be used for any React project.",
          },
          {
            title: 'Angular',
            subtitle: "This pipeline can be used for any Angular project.",
          },
          {
            title: 'Node',
            subtitle: "The pipeline can be utilized for any Node project.",
          },
          {
            title: 'Notifications',
            subtitle: "Get notified on Slack about the status of your pipeline.",
          },
          {
            title: 'Deployment',
            subtitle: "Deploy your project to AWS S3 or EC2 seamlesly.",
          },
				]}
			/>

			<FeatureShowcase
				title='For developers by developers'
				text='We are a team of developers who have been working on JavaScript projects for more than 10 years. We have built a lot of projects and we have learned a lot along the way. This pipeline is a result of that experience.'
				imageUrl='/js-pipeline/img/gha.svg'
				gray
			/>

		</Layout>
	);
}