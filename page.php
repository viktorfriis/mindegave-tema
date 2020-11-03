<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package mindegave
 */
get_header(); ?>
    <div id="primary" class="content-area">
        <main id="main" class="site-main">
        <section>
            <div class="grid-container">
                <h1><?php echo the_title(); ?></h1>
            </div>
        </section>
            <?php
            while(have_posts()) : the_post();
                get_template_part('template-parts/hero', 'banner');
                if (class_exists('ACF')) {
                	get_template_part('template-parts/content', 'flex');
                } else {
                	get_template_part('template-parts/content', 'page');
                }
            endwhile; // End of the loop.?>
        </main><!-- #main -->
    </div><!-- #primary -->
<?php get_footer();
