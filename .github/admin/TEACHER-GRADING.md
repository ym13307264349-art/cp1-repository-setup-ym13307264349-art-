# CP1 Teacher Grading

CP1 uses one mother/template repository plus student copies.

## Architecture

```text
KLIS-CS/GitHub-Repository-Setup
→ students use Copy Exercise
→ each student works in cp1-repository-setup-USERNAME
→ student repo creates/updates CP1 — Score
→ student submits repo URL to the mother repository
→ teacher reviews files and enters /manual-grade in the mother repository
→ teacher score is published to the grades branch
→ student repo pulls the teacher score into its own CP1 — Score Issue
```

Students work directly on `main`. CP1 does not use feature branches or Pull Requests.

## Automatic score — 60

| Check | Points |
|---|---:|
| Repository setup | 10 |
| `README.md` | 20 |
| `.gitignore` | 15 |
| `LICENSE` | 15 |
| **Automatic subtotal** | **60** |

The same repository checks are used by the mother grader and the student's local Score Issue.

## Teacher review — 40

Use the central CP1 Submission Issue in this mother repository. The Teacher Review Files bot shows direct links and previews for the student's:

```text
README.md
.gitignore
LICENSE
```

Grade with:

```text
/manual-grade
README: 0/10
.gitignore: 0/10
LICENSE: 0/10
Reasoning: 0/10

Feedback:
Write concise feedback here.
```

The four categories total `/40`.

The short form is still accepted:

```text
/manual-grade 36
```

## Score synchronization

When a valid teacher grade is posted in the mother repository, the mother workflow publishes a small grade record on the `grades` branch under:

```text
.cp1-grades/GITHUB-USERNAME.json
```

The student's `CP1 — Student Score` workflow reads that record and updates the student's own `CP1 — Score` Issue.

Students therefore see their final score and teacher feedback in their own repository, while the teacher grades from one central place.

## Important repository visibility rule

For the no-secret synchronization design, the mother repository must remain **Public** because student repositories read their grade record from the public `grades` branch. Student repositories are also expected to be Public for CP1 automatic grading.
