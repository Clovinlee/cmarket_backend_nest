import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

function handlebarTemplate(placeHolderReplacements: Record<string, string>, htmlTemplatePath:string =  path.resolve() + "/src/mail/template/index.html", imageTemplatePath:string = path.resolve() + "/src/mail/template/images/"): string{
    const source: string = fs.readFileSync(htmlTemplatePath, 'utf8').toString();
    const template = Handlebars.compile(source);
    const htmlToSend: string = template(placeHolderReplacements);

    return htmlToSend;
}

export {handlebarTemplate}