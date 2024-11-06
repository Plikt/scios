"use client";

import Navigation from "./components/section/navigation";
import Product from "./components/product";
import ProjectSection from "./components/section/projectSection";
import Footer from "./components/section/footer";
import EventSection from "./components/section/eventSection";
import SupporterSection from "./components/section/supporterSection";
import Banner from "./components/section/banner";
import BlobBackground from "./components/background";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import NewsletterSubscription from "./components/newsletterSubscription";

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="absolute sticky top-0 bg-white w-full px-6 md:px-16 z-50 h-[80px]">
				<Navigation />
			</div>
			<div className="flex flex-col w-full">
				{/* Hero Section */}
				<div className="relative min-h-[calc(100vh-80px)] flex flex-col">
					{/* Blob background */}
					<BlobBackground />

					{/* Hero Content */}
					<div className="flex-grow flex items-center z-10">
						<div className="w-full md:w-2/3 px-6 md:px-16">
							<h1>We advance infrastructure</h1>
							<h2 className="font-openSans font-medium text-[28px]">
								We coordinate people and organizations deeply 
								invested in building sustainable infrastructure, coordination layers, 
								and operating systems for the scientific endeavor. 
							</h2>
						</div>
					</div>

					{/* Banner - now will stick to bottom */}
					<div className="w-full z-10">
						<Banner />
					</div>
				</div>

				{/* Product section */}
				<section
					id="product"
					className="bg-primary w-full flex flex-col gap-8 text-white justify-center pt-36 pb-36 px-6 md:px-16 "
				>
					<div className="flex flex-col p-4 md:px-36">
						<h1 className="w-full text-center">What we do</h1>
						<p className="w-full text-center">
							SciOS is a collaborative organization dedicated to ensuring the
							stable and sustainable operation of a scientific system and supply
							chain that is open, efficient, and accessible. We believe that the
							convergence of culture and technology is critical to achieve this
							vision. SciOS maintains a collaborative environment for academics,
							researchers, technologists, innovators, funders, decision makers,
							institutions, corporations, and the public.
						</p>
					</div>

					<Product
						title={"Connect"}
						icon="connect.svg"
						text={
							"Our network of researchers, technologists, leaders, decision makers, builders, and thinkers are passionately dedicated to rapid advancements in data, compute, recognition, provenance, reproducibility, AI, collaboration, and social infrastructure. We don't desire a future of open science. We're building one."
						}
						imageSrc={"connect.png"}
						ctaText="Join our network"
					/>
					<Product
						title="Build"
						icon="build.svg"
						text="Our workshops lead to clear outputs. Every workshop, working group, and hackathon is grounded in the results the community needs. No reports. No research questions. No requests for signature. Systems, structures, and code."
						imageSrc="build.png"
						hyperlink="#projects"
						hyperlinkText="See supported projects"
						reverse={true}
					/>
					<Product
						title="Share"
						icon="share.svg"
						text="Our workshop outputs are synthesized into resources accessible and understandable by everyone. All technology we facilitate is open source. We proactively share each output across our network so the most engaged and impacted individuals stay on the cutting edge."
						imageSrc="share.png"
						hyperlink="#"
						hyperlinkText="Subscribe to our newsletter"
						onClick={() => setIsOpen(true)}
					/>
				</section>

				<section id="projects" className="pt-24 px-6 md:px-16">
					<ProjectSection />
				</section>
				<section id="events" className="pt-24 px-6 md:px-16">
					<EventSection />
				</section>
				<section className="pt-24 px-6 md:px-16">
					<SupporterSection />
				</section>
				<section className="pt-32">
					<Footer />
				</section>
			</div>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				{/* The backdrop, rendered as a fixed sibling to the panel container */}
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

				{/* Full-screen container to center the panel */}
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6">
						<div className="flex flex-col">
							<div className="flex justify-end">
								<button
									onClick={() => setIsOpen(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									x
								</button>
							</div>
							<NewsletterSubscription />
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	);
}
