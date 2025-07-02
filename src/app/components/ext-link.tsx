import { Anchor } from "@mantine/core";
import { LinkExternalIcon } from "@primer/octicons-react";

export const ExtLink = ({ href, children }: { href: string; children: React.ReactNode; }) =>
    <Anchor href={href} target="_blank">{children} <LinkExternalIcon className="inline" /></Anchor>;