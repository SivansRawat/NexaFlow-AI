"""
MailCraft AI RAG Knowledge Base Seed
Ingests high-converting copywriting frameworks, cold email structures,
subject line formulas, and tone polishing guidelines into ChromaDB.
"""

import asyncio
from app.services.ingestion_service import ingestion_service

MAILCRAFT_TEMPLATES = [
    {
        "id": "tpl_aida_framework",
        "text": """
Framework: AIDA (Attention, Interest, Desire, Action) Email Copywriting
Usage: Best for sales outreach, cold emails, product launches, and promotional campaigns.
Structure:
1. Attention: Hook the reader in the subject line and opening sentence with an undeniable benefit or curiosity gap.
2. Interest: Present compelling facts, data, or relatable pain points to keep the reader engaged.
3. Desire: Highlight how your product/service solves their specific problem with proof or benefits.
4. Action: Include a single, clear, low-friction Call-To-Action (CTA) such as 'Are you open to a 10-min chat this week?'.
        """,
        "metadata": {"category": "framework", "type": "sales", "name": "AIDA Framework"}
    },
    {
        "id": "tpl_pas_framework",
        "text": """
Framework: PAS (Problem, Agitate, Solve) Email Copywriting
Usage: Excellent for B2B cold outreach, consulting offers, and SaaS pitches.
Structure:
1. Problem: Clearly state the specific pain point the prospect is facing.
2. Agitate: Deepen the emotional or financial impact of leaving the problem unsolved (lost revenue, wasted time, high churn).
3. Solve: Position your solution as the easiest and most reliable way to eliminate the pain.
4. CTA: Ask a simple interest-based question.
        """,
        "metadata": {"category": "framework", "type": "b2b", "name": "PAS Framework"}
    },
    {
        "id": "tpl_cold_outreach_b2b",
        "text": """
Template: High-Converting B2B Cold Email
Subject Line Options:
- Quick question regarding {company_name}
- Ideas for {prospect_goal} at {company_name}
Opening: Hi {first_name}, noticed your recent growth at {company_name} in {industry}.
Body: Most {job_title}s we speak with struggle with {main_pain_point}. We helped {similar_company} achieve {quantifiable_result} within {timeframe} by implementing {unique_solution}.
Closing: Would you be open to a quick 5-minute call next Tuesday to see if this could work for {company_name}?
        """,
        "metadata": {"category": "cold_outreach", "type": "b2b", "name": "B2B Cold Outreach"}
    },
    {
        "id": "tpl_job_application",
        "text": """
Template: Professional Job Application & Cover Email
Subject Line Options:
- Application for {job_title} - {applicant_name}
- Candidate Inquiry: {job_title} role - {applicant_name}
Opening: Dear Hiring Manager / {manager_name},
Body: I am writing to express my strong interest in the {job_title} position at {company_name}. With over {years_experience} years of experience in {key_skill_1} and {key_skill_2}, I have a proven track record of {key_achievement}.
Value Add: In my previous role at {previous_company}, I led {project_name} which resulted in {quantifiable_metric}. I am confident my background in {core_competency} aligns perfectly with your team's goals.
Call to Action: I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to {company_name}.
        """,
        "metadata": {"category": "career", "type": "job_application", "name": "Job Application Email"}
    },
    {
        "id": "tpl_subject_line_formulas",
        "text": """
Subject Line Formulas for Maximum Open Rates (40%+ Open Rates):
1. Curiosity Gap: 'The #1 mistake most {job_title}s make with {topic}'
2. Personal & Direct: 'Quick question for {first_name}'
3. Social Proof / Result: 'How {company_name} boosted conversions by {percentage}%'
4. Urgency / Scarcity: 'Last chance: {webinar_name} starts in 2 hours'
5. How-To / Value: 'How to automate {workflow} in under 10 minutes'
Rules: Keep under 50 characters, avoid spam trigger words (FREE, $$$), use natural capitalization.
        """,
        "metadata": {"category": "subject_lines", "type": "optimization", "name": "Subject Line Formulas"}
    },
    {
        "id": "tpl_tone_polisher_guidelines",
        "text": """
Tone Polishing & Professional Formatting Guidelines:
1. Executive Tone: Direct, confident, concise. Remove passive voice, filler words ('just', 'I think', 'maybe', 'sorry to bother').
2. Formal Business Tone: Respectful, polite, structured with clear paragraphs and professional salutations.
3. Friendly / Persuasive Tone: Warm, empathetic, collaborative, engaging, ending with a low-friction question.
Formatting: Ensure paragraphs are 2-3 sentences max. Use bullet points for lists. Bold key numbers or metrics.
        """,
        "metadata": {"category": "tone_polisher", "type": "guidelines", "name": "Tone Guidelines"}
    }
]

async def seed_mailcraft_knowledge():
    """Seed MailCraft templates into ChromaDB collection mailcraft_templates"""
    collection = "mailcraft_templates"
    print(f"🌱 Seeding MailCraft RAG knowledge base into ChromaDB collection '{collection}'...")
    
    for tpl in MAILCRAFT_TEMPLATES:
        try:
            await ingestion_service.ingest_document(
                document_id=tpl["id"],
                document_text=tpl["text"].strip(),
                metadata=tpl["metadata"],
                collection_name=collection
            )
            print(f"  ✓ Ingested {tpl['id']}: {tpl['metadata']['name']}")
        except Exception as e:
            print(f"  ⚠️ Error ingesting {tpl['id']}: {e}")

    print("✅ MailCraft RAG Knowledge Base Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(seed_mailcraft_knowledge())
