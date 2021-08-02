// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

context('Move a task between projects.', () => {
    const caseID = 94;
    const firtsProject = {
        name: `Firts project case ${caseID}`,
        label: 'car',
        attrName: 'color',
        attrVaue: 'red',
        multiAttrParams: false
    }

    const secondProject = {
        name: `Second project case ${caseID}`,
        label: 'bicycle',
        attrName: 'color',
        attrVaue: 'yellow',
        multiAttrParams: false
    }

    const taskName = `Task case ${caseID}`;
    const imagesCount = 1;
    const imageFileName = `image_${taskName.replace(/\s+/g, '_').toLowerCase()}`;
    const width = 800;
    const height = 800;
    const posX = 10;
    const posY = 10;
    const color = 'white';
    const archiveName = `${imageFileName}.zip`;
    const archivePath = `cypress/fixtures/${archiveName}`;
    const imagesFolder = `cypress/fixtures/${imageFileName}`;
    const directoryToArchive = imagesFolder;
    const advancedConfigurationParams = false;
    const forProject = true;
    const attachToProject = false;
    const multiAttrParams = false;

    function checkTask (project, expectedResult) {
        cy.goToProjectsList();
        cy.openProject(project);
        cy.get('.cvat-tasks-list-item').should(expectedResult);
    }

    before(() => {
        cy.imageGenerator(imagesFolder, imageFileName, width, height, color, posX, posY, firtsProject.label, imagesCount);
        cy.createZipArchive(directoryToArchive, archivePath);
        cy.visit('/');
        cy.login();
    });

    beforeEach(() => {
        cy.goToProjectsList();
        cy.createProjects(firtsProject.name, firtsProject.label, firtsProject.attrName, firtsProject.attrVaue, firtsProject.multiAttrParams);
        cy.createProjects(secondProject.name, secondProject.label, secondProject.attrName, secondProject.attrVaue, secondProject.multiAttrParams);
        cy.openProject(firtsProject.name);
        cy.createAnnotationTask(
            taskName,
            firtsProject.label,
            firtsProject.attrName,
            firtsProject.attrVaue,
            archiveName,
            multiAttrParams,
            advancedConfigurationParams,
            forProject,
            attachToProject.no,
            firtsProject.name,
        );
    });

    afterEach(() => {
        cy.goToProjectsList();
        cy.openProject(firtsProject.name);
        cy.deleteProjectViaActions(firtsProject.name);
        cy.openProject(secondProject.name);
        cy.deleteProjectViaActions(secondProject.name);
    });

    describe(`Testing "Case ${caseID}"`, () => {
        it('Move a task between projects from a project.', () => {
            checkTask(secondProject.name, 'not.exist');
            checkTask(firtsProject.name, 'exist');
            cy.movingTask(taskName, secondProject.name, firtsProject.label, secondProject.label);
            checkTask(firtsProject.name, 'not.exist');
            checkTask(secondProject.name, 'exist');
        });

        it('Move a task between projects from task list.', () => {
            cy.goToTaskList();
            cy.movingTask(taskName, secondProject.name, firtsProject.label, secondProject.label);
            checkTask(firtsProject.name, 'not.exist');
            checkTask(secondProject.name, 'exist');
        });

        it('Move a task between projects from a task.', () => {
            cy.goToTaskList();
            cy.openTask(taskName);
            cy.movingTask(taskName, secondProject.name, firtsProject.label, secondProject.label, true);
            checkTask(firtsProject.name, 'not.exist');
            checkTask(secondProject.name, 'exist');
        });
    });
});
