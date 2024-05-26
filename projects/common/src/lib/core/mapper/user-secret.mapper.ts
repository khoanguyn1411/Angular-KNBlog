import { Injectable } from '@angular/core';

import { UserSecret } from '../models/user-secret';

import { UserSecretCreationDto, UserSecretDto } from '../dtos/user-secret.dto';

import { MapperFromDto } from './mappers';

/** User secret mapper. */
@Injectable({
	providedIn: 'root',
})
export class UserSecretMapper
implements MapperFromDto<UserSecretDto, UserSecret> {
	/** @inheritdoc */
	public toDto(model: UserSecret): UserSecretCreationDto {
		return {
      refreshToken: model.refreshToken,
		};
	}

	/** @inheritdoc */
	public fromDto(dto: UserSecretDto): UserSecret {
		return {
			accessToken: dto.accessToken,
			refreshToken: dto.refreshToken,
		};
	}
}
