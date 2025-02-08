import { Entity, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'
import { QueuedStemEntity } from './queued-stem.entity'

@Entity('project_queues')
export class ProjectQueueEntity extends BaseEntity<ProjectQueueEntity> {
	@JoinColumn()
	@OneToMany(() => QueuedStemEntity, entity => entity.queue, { cascade: true })
	stems: QueuedStemEntity[]
}
