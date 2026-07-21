"""
Universal Platform RAG Seed - Ingests vector templates for SocialPro AI,
Bulk Mailer AI, SmartDocs Suite, and Excel Genius Suite into ChromaDB.
"""

import asyncio
from app.services.ingestion_service import ingestion_service

SOCIALPRO_TEMPLATES = [
    {
        "id": "soc_viral_hooks",
        "text": """
Category: Social Media Viral Hooks & Openers
Usage: Best for Instagram Reels, LinkedIn posts, X/Twitter threads, and TikTok captions.
Hooks:
1. 'Stop doing {common_mistake}. Do this instead if you want {desired_result}.'
2. 'The exact framework I used to reach {metric} in under {timeframe}.'
3. '99% of people get {topic} wrong. Here is the 1% secret:'
4. 'How to achieve {goal} without {major_pain_point}.'
CTA: 'Save this post for later 📌 and drop a comment below!'
        """,
        "metadata": {"category": "socialpro", "type": "hooks", "name": "Viral Social Hooks"}
    },
    {
        "id": "soc_ad_copy_framework",
        "text": """
Category: High-Converting Social Ad Copy (AIDA & PAS for Ads)
Usage: Meta Ads, LinkedIn Sponsored Content, Google Ads.
Structure:
- Hook: Bold question or pattern-interrupt statement.
- Problem / Agitation: Address the audience's exact daily frustration.
- Solution: Introduce product with 3 key bullet-point benefits.
- Social Proof: 'Trusted by over 10,000+ creators and teams.'
- CTA: 'Click Sign Up today to get 50% off!'
        """,
        "metadata": {"category": "socialpro", "type": "ad_copy", "name": "Social Ad Framework"}
    }
]

BULKMAILER_TEMPLATES = [
    {
        "id": "bulk_sequence_framework",
        "text": """
Category: Bulk Mailer Cold Outreach & Nurture Sequences
Sequence Structure:
Email 1 (Day 1 - Intro): Short, direct value proposition with interest-based CTA.
Email 2 (Day 3 - Follow Up): Case study / social proof snippet ('Thought you might find this case study interesting').
Email 3 (Day 7 - Value Add): Free resource or actionable tip relevant to prospect's role.
Email 4 (Day 12 - Breakup): Polite closing ('Should I assume this isn't a priority right now?').
        """,
        "metadata": {"category": "bulkmailer", "type": "sequence", "name": "Cold Sequence Engine"}
    }
]

SMARTDOCS_TEMPLATES = [
    {
        "id": "doc_invoice_proposal",
        "text": """
Category: SmartDocs Corporate Invoice & Proposal Template
Structure:
- Header: Company Name, Logo, Invoice ID, Date, Due Date.
- Bill To: Client Name, Company, Address, Tax ID.
- Line Items Table: Item Description, Quantity, Unit Price, Total.
- Payment Terms: Net 30 days. Wire transfer / ACH details.
- Footer: Thank you for your business! Contact support@company.com for billing inquiries.
        """,
        "metadata": {"category": "smartdocs", "type": "invoice", "name": "Corporate Invoice Template"}
    },
    {
        "id": "doc_offer_letter",
        "text": """
Category: Employment Offer Letter Template
Structure:
- Formal Salutation: Dear {candidate_name},
- Role Details: Job Title, Reporting Manager, Start Date, Work Location (Remote/Hybrid).
- Compensation & Benefits: Annual Base Salary, Health Insurance, Stock Options, PTO days.
- Acceptance Deadline: Offer valid until {deadline_date}.
- Closing: We are thrilled to welcome you to the team!
        """,
        "metadata": {"category": "smartdocs", "type": "offer_letter", "name": "Offer Letter Template"}
    }
]

EXCEL_TEMPLATES = [
    {
        "id": "excel_formula_patterns",
        "text": """
Category: Advanced Excel Formulas & Logical Patterns
Formulas:
1. XLOOKUP (Modern VLOOKUP): =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
2. SUMIFS (Multi-condition sum): =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2)
3. INDEX MATCH: =INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
4. Error Handling: =IFERROR(formula, "N/A")
5. Nested IF: =IFS(condition1, value1, condition2, value2, TRUE, default_value)
        """,
        "metadata": {"category": "excel", "type": "formulas", "name": "Excel Formulas"}
    },
    {
        "id": "excel_error_detection",
        "text": """
Category: Excel Error Detection & Data Cleaning Rules
Common Errors:
- #N/A: Value not found in lookup. Solution: Wrap in IFERROR or verify lookup value exists.
- #VALUE!: Incorrect data type in formula (text instead of number). Solution: Use VALUE() or clean spaces.
- #REF!: Invalid cell reference. Solution: Restore deleted columns/rows.
- Data Quality: Trim leading spaces with =TRIM(cell), remove duplicates, format dates as YYYY-MM-DD.
        """,
        "metadata": {"category": "excel", "type": "error_detection", "name": "Excel Error Rules"}
    }
]

async def seed_platform_knowledge():
    """Seed all platform templates into ChromaDB"""
    seeds = [
        ("socialpro_templates", SOCIALPRO_TEMPLATES),
        ("bulkmailer_templates", BULKMAILER_TEMPLATES),
        ("smartdocs_templates", SMARTDOCS_TEMPLATES),
        ("excel_templates", EXCEL_TEMPLATES),
    ]

    print("🌱 Seeding Universal Platform RAG Knowledge Base into ChromaDB...")

    for collection_name, dataset in seeds:
        for item in dataset:
            try:
                await ingestion_service.ingest_document(
                    document_id=item["id"],
                    document_text=item["text"].strip(),
                    metadata=item["metadata"],
                    collection_name=collection_name
                )
                print(f"  ✓ [{collection_name}] Ingested {item['id']}")
            except Exception as e:
                print(f"  ⚠️ [{collection_name}] Skip {item['id']}: {e}")

    print("✅ Universal Platform RAG Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(seed_platform_knowledge())
