import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FilterPipeModule } from '@fuse/pipes/filter';
import { FuseConfirmationModule } from '@fuse/services/confirmation';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // FilterPipeModule,
        FuseConfirmationModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // FilterPipeModule,
        FuseConfirmationModule
    ]
})
export class SharedModule
{
}
