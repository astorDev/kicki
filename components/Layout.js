import React from 'react';
import { Menu, MenuMenu, Container } from 'semantic-ui-react';
import Head from 'next/head';
import routes from '../routes';
import Link from 'next/link';

function Layout({ children }) {

    const renderHeader = () => {
        return (
            <Menu>
                <Menu.Item>
                    <Link href="/">Kicki</Link>
                </Menu.Item>
                <MenuMenu position="right">
                    <Menu.Item>
                        <Link href="/">Campaigns</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/campaigns/creator">+</Link>
                    </Menu.Item>
                </MenuMenu>
            </Menu>
        )
    }

    return (
        <div>
            {renderHeader()}
            <Container>
                {children}
                <Head>
                    <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
                </Head>
            </Container>
        </div>
    );
}

export default Layout;