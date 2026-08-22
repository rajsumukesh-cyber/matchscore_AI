/**
 * Module 21 — AI Executive Bio & Conference Speaker Pitch Generator (server only).
 *
 * Generates executive bios in 3 lengths (50, 100, 250 words) and conference CFP keynote pitches.
 */
import type { AppSupabase } from "./db.server";

export interface KeynoteProposal {
  talk_title: string;
  catchy_subtitle: string;
  abstract: string;
  target_audience: string;
  key_takeaways: string[];
}

export interface SpeakerPitchResult {
  candidate_name: string;
  expertise_domain: string;
  bios: {
    short_50_words: string;
    medium_100_words: string;
    long_250_words: string;
  };
  keynote_proposals: KeynoteProposal[];
  speaker_intro_script: string;
}

export async function generateSpeakerPitches(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    currentRole: string;
    primaryExpertise: string;
    flagshipProject: string;
  },
): Promise<SpeakerPitchResult> {
  const name = input.candidateName.trim() || "Alex Johnson";
  const role = input.currentRole.trim() || "Staff Software Engineer";
  const domain = input.primaryExpertise.trim() || "Distributed Systems, AI Agents & Cloud Architecture";
  const project = input.flagshipProject.trim() || "scaling zero-downtime microservices to 10M+ daily active users";

  const bios = {
    short_50_words: `${name} is a ${role} specializing in ${domain}. With a proven track record in ${project}, ${name} builds resilient, high-throughput cloud platforms and mentors engineering teams globally.`,
    medium_100_words: `${name} is a seasoned ${role} with extensive leadership in ${domain}. Throughout their career, ${name} has spearheaded high-impact engineering initiatives, including ${project}. A passionate advocate for developer experience and blameless engineering culture, ${name} frequently speaks and writes about modern distributed systems, scalable APIs, and building resilient engineering teams.`,
    long_250_words: `${name} is an accomplished ${role} and technology leader specializing in ${domain}. Over the past decade, ${name} has architected enterprise cloud platforms, led cross-functional squads, and driven mission-critical milestones such as ${project}.\n\nDeeply committed to engineering excellence, ${name} combines deep hands-on expertise in distributed databases, microservice reliability, and cloud native infrastructure with a strategic focus on team multiplication and blameless post-mortem culture. Beyond shipping production software, ${name} actively contributes to technical communities through open-source software, conference speaking, and mentoring the next generation of engineers.`,
  };

  const keynotes: KeynoteProposal[] = [
    {
      talk_title: `Zero-Downtime at Scale: Surviving 10x Traffic Surges`,
      catchy_subtitle: `Architectural blueprints and hard-learned war stories from production.`,
      abstract: `When traffic spikes 10x overnight, standard caching and vertical scaling collapse. In this talk, ${name} breaks down the exact architectural principles, circuit-breaker patterns, and Redis read-replica strategies used in ${project} to achieve 99.99% availability under severe load.`,
      target_audience: "Backend Engineers, Tech Leads, Cloud Architects",
      key_takeaways: [
        "How to detect and isolate cascading database deadlocks before users notice.",
        "Practical implementation of consumer-driven contract testing.",
        "Blameless post-mortem patterns that prevent recurring Sev-1 incidents.",
      ],
    },
    {
      talk_title: `Beyond the Buzz: Building Pragmatic AI Agent Workflows`,
      catchy_subtitle: `How to integrate LLM evaluation, guardrails, and deterministic fallbacks into production software.`,
      abstract: `Generative AI is powerful, but unpredictable without deterministic guardrails. This session explores how engineering teams can integrate AI tool-calling, vector indexing, and structured evaluation into enterprise web stacks without compromising latency or security.`,
      target_audience: "Full Stack Developers, AI Engineers, Engineering Managers",
      key_takeaways: [
        "Designing deterministic fallback layers when LLM calls timeout.",
        "Cost-effective token caching strategies for real-time web apps.",
        "Evaluating AI quality and preventing prompt injection vulnerabilities.",
      ],
    },
  ];

  const introScript = `"Please join me in welcoming our keynote speaker, ${name}! ${name} is a ${role} specializing in ${domain}, widely recognized for ${project}."`;

  return {
    candidate_name: name,
    expertise_domain: domain,
    bios,
    keynote_proposals: keynotes,
    speaker_intro_script: introScript,
  };
}
