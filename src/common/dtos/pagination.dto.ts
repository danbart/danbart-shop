import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 10,
        description: 'The number of items to return',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // enableImplicitConversion: true
    limit?: number;

    @ApiProperty({
        required: false,
        default: 0,
        description: 'The number of items to skip before starting to collect the result set',
    })
    @IsOptional()
    @Type(() => Number) // enableImplicitConversion: true
    @Min(0)
    offset?: number;
}