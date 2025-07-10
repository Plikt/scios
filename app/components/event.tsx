"use client";
import { useState } from "react";
import MinusIcon from "./../../public/icons/minus.svg";
import PlusIcon from "./../../public/icons/plus.svg";
import Button from "./button";
import Hyperlink from "./hyperlink";
import Image from "next/image";
import PersonIcon from "./../../public/icons/person.svg";

export interface SpeakerProps {
	imageUrl: string;
	name: string;
	affiliation: string;
}
const Speaker: React.FC<SpeakerProps> = ({
	imageUrl,
	name,
	affiliation = "",
}) => {
	return (
		<div className="flex gap-2">
			{imageUrl ? (
				<img src={imageUrl} alt={name} className="rounded-full h-10 w-10" />
			) : (
				<PersonIcon className="w-10 h-10 bg-light-grey rounded-full p-2" />
			)}
			<div className="flex flex-col ">
				<p>{name}</p>
				<p className="text-sm text-dark-grey">{affiliation}</p>
			</div>
		</div>
	);
};
export interface EventDetailProps {
	timeFrame: string;
	title: string;
	description: string;
	speakers: SpeakerProps[];
}

const EventDetail: React.FC<EventDetailProps> = ({
	timeFrame,
	title,
	description,
	speakers,
}) => {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:gap-20 md:justify-between">
			<div className="flex gap-8 md:w-2/3">
				<p className="w-24">{timeFrame}</p>
				<div className="flex flex-col flex-1">
					<p className="font-bold">{title}</p>
					<p className="text-sm">{description}</p>
				</div>
			</div>
			<div className="flex flex-col w-full gap-2 md:w-1/3 invisible md:visible">
				{speakers.map((speaker, index) => {
					return (
						<div id={index.toString()}>
							<Speaker
								name={speaker.name}
								imageUrl={speaker.imageUrl}
								affiliation={speaker.affiliation}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export interface EventProps {
	title: string;
	date: string;
	hosts: string[];
	location: string;
	eventLink?: string;
	description: string;
	oldResources?: Array<{ href: string; text: string }>;
	agenda?: EventDetailProps[];
	isOld?: boolean | string;
}

const EventCard: React.FC<EventProps> = ({
	title,
	date,
	hosts,
	location,
	eventLink,
	description,
	oldResources,
	agenda = [],
	isOld = false,
}) => {
	const [expanded, setExpanded] = useState(false);
	return (
		<div
			className={`w-full ${
				expanded ? "bg-accent-2" : "bg-[#f7dfcd]"
			} hover:bg-accent-2 flex flex-col px-7 py-4 rounded-lg gap-7`}
		>
			<div
				className="flex justify-between"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex flex-col gap-2 md:flex-row md:gap-12">
					<div className="font-bold w-36">{date}</div>
					<div className="flex flex-col">
						<h4>{title}</h4>
						<div className="flex flex-row gap-4">
							{hosts.map((host, index) => {
								return <span key={index.toString()}>{host}</span>;
							})}
							{hosts.length > 0 && <p className="font-bold">·</p>}
							<p>{location}</p>
						</div>
					</div>
				</div>

				<div className="flex w-fit items-center">
					{expanded ? <MinusIcon /> : <PlusIcon />}
				</div>
			</div>
			{expanded && (
				<>
					<div dangerouslySetInnerHTML={{ __html: description }} className="prose prose-sm max-w-none" />
					{oldResources && oldResources.length > 0 ? (
						<div className="flex gap-4">
							{oldResources.map((resouce, index) => {
								return (
									<div key={index.toString()}>
										<Hyperlink
											text={resouce.text}
											url={resouce.href}
											className="text-dark-grey"
										/>
									</div>
								);
							})}
						</div>
					) : (
						<Button
							text="Learn more"
							color="primary"
							onClick={() => {
								window.open(eventLink, "_blank");
							}}
						/>
					)}

					{agenda && agenda.length > 0 && (
						<div className="flex-col flex gap-6">
							<h4 className="border-b border-dark-grey pb-2">Agenda</h4>
							{agenda.map((each, index) => {
								return (
									<div key={index.toString()}>
										<EventDetail
											timeFrame={each.timeFrame}
											title={each.title}
											description={each.description}
											speakers={each.speakers}
										/>
									</div>
								);
							})}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default EventCard;
