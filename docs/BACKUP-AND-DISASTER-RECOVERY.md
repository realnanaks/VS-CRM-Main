# Backup and Disaster Recovery

**Last updated:** 2025-12-09

## Backup Strategy

### Database (PostgreSQL)
1.  **Continuous Archiving (WAL):** Enabled for Point-In-Time Recovery (PITR).
2.  **Daily Snapshots:**
    - **Time:** 02:00 AM EAT.
    - **Retention:** 30 days.
    - **Storage:** AWS S3 (Glacier after 7 days).

### File Storage (S3)
- **Versioning:** Enabled on the S3 bucket. If a file is overwritten or deleted, previous versions are retained for 30 days.
- **Replication:** Cross-Region Replication (CRR) to a secondary region (e.g., eu-central-1) for disaster resilience.

## Disaster Recovery (DR) Plan

### Scenario 1: Critical Bug in Production
1.  **Rollback:** Revert to the previous Docker image tag in the deployment pipeline.
    ```bash
    git revert <commit-hash>
    git push origin main
    ```

### Scenario 2: Data Corruption / Accidental Deletion
1.  **Identifying Scope:** Determine the time of corruption.
2.  **Restore:**
    - Spin up a new RDS instance from the latest clean snapshot (or PITR).
    - Point the backend `DATABASE_URL` to the new instance.
    - Verify data integrity.
    - Switch DNS or Load Balancer to the new backend.

### Scenario 3: Region Outage
1.  **Failover:**
    - Update DNS (Route53) to point to the secondary region standby.
    - Promote the Read Replica DB in the secondary region to Primary.
