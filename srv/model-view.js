const cds = require('@sap/cds');

module.exports = class labelservice extends cds.ApplicationService {
    init(srv) {
        const { Musicians, Recordings, Distributions } = srv.entities;

        srv.before('CREATE', Recordings, async (req) => {
            const { hourQuantity } = req.data;

            try {
                console.log('hourQuantity', hourQuantity);

                if (hourQuantity >= 6) {
                    req.data.promo = true;
                    req.data.hourQuantity = hourQuantity + 2;
                }
            } catch (error) {
                req.reject(400, error);
            }
        });

        srv.before('UPDATE', Recordings, async (req) => {
            const { ID, hourQuantity } = req.data;
            console.log('hourQuantity', hourQuantity);

            try {
                const query = await SELECT.from(Recordings, { ID });
                console.log('query', query);

                if (query) {
                    if (hourQuantity >= 6 && query.promo === false) {
                        req.data.promo = true;
                        req.data.hourQuantity = hourQuantity + 2;
                    } else if (hourQuantity < 6 && query.promo === true) {
                        req.data.promo = false;
                        req.data.hourQuantity = hourQuantity - 2;
                    }
                }
            } catch (error) {
                req.reject(400, error);
            }
        });

        srv.on('deleteMusicians', async (req) => {
            console.log(req.data.value);
            const ID = req.data.value;

            try {
                const musicians = await SELECT.from(Musicians).columns('name', 'lastname').where({ ID });
                console.log('musicians', musicians);

                // await DELETE.from(Musicians).where({ ID }); => Igual que la de abajo
                await DELETE.from(Musicians, { ID });
                // las horas de grabación vinculadas al músico también son eliminadas debido a la composition (Recordings)

                musicians.forEach(element => {
                    console.log(`Músico eliminado: ${element.name} ${element.lastname}`);
                });
            } catch (error) {
                req.reject(400, error);
            }
        });

        srv.on('createMusicians', async (req) => {
            const value = req.data.value;
            console.log(value);

            try {
                await INSERT(value).into(Musicians);

                const oMessage = {
                    code: 200,
                    message: `Número de filas insertas ${value.length}`
                }
                return oMessage;
            } catch (error) {
                req.reject(400, error);
            }
        });

        srv.on('musicianID', async (req) => {
            const { ID } = req.data;
            console.log(ID);

            try {
                const query = await SELECT.from(Musicians, { ID });
                return query;
            } catch (error) {
                req.reject(400, error);
            }
        });

        // Muestras
        srv.before('*', Musicians, async (req) => {
            console.log(`se realizó el método ${req.method}.`);
        });

        srv.before(['CREATE', 'UPDATE'], Distributions, async () => {
            console.log('Prueba de create y update en la entidad Distributions');
        });
        return super.init()
    }
}